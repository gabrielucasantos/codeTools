import DOMPurify from 'dompurify';
import { XPathResultType } from '../types';
import { translations } from '../i18n/translations';

export class XPathGenerator {
  private static parseHTML(html: string): Document {
    const cleanHTML = DOMPurify.sanitize(html);
    const parser = new DOMParser();
    return parser.parseFromString(cleanHTML, 'text/html');
  }

  private static getAttributeBasedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    
    // ID-based
    const id = element.getAttribute('id');
    if (id) {
      xpaths.push(`//${tagName}[@id='${id}']`);
      xpaths.push(`//*[@id='${id}']`);
    }

    // Class-based
    const className = element.getAttribute('class');
    if (className) {
      const classes = className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        xpaths.push(`//${tagName}[contains(@class, '${classes[0]}')]`);
        if (classes.length > 1) {
          xpaths.push(`//${tagName}[${classes.map(c => `contains(@class, '${c}')`).join(' and ')}]`);
          // Add a more specific version with position
          const position = this.getElementPosition(element);
          if (position > 0) {
            xpaths.push(`(//${tagName}[${classes.map(c => `contains(@class, '${c}')`).join(' and ')}])[${position}]`);
          }
        }
      }
    }

    // Data attributes
    ['data-testid', 'data-id', 'data-automation', 'data-cy', 'data-test'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        xpaths.push(`//${tagName}[@${attr}='${value}']`);
        xpaths.push(`//*[@${attr}='${value}']`);
      }
    });

    // ARIA attributes
    ['role', 'aria-label', 'aria-labelledby', 'aria-describedby'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        xpaths.push(`//${tagName}[@${attr}='${value}']`);
        xpaths.push(`//*[@${attr}='${value}']`);
      }
    });

    return xpaths;
  }

  private static getTextBasedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim();
    
    if (text) {
      // Exact text match with tag
      xpaths.push(`//${tagName}[text()='${text}']`);
      
      // Text contains with tag
      xpaths.push(`//${tagName}[contains(text(), '${text}')]`);
      
      // Normalize space with tag
      xpaths.push(`//${tagName}[normalize-space()='${text}']`);

      // Case-insensitive contains
      xpaths.push(`//${tagName}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')]`);

      // With position if multiple matches exist
      const position = this.getElementPosition(element);
      if (position > 0) {
        xpaths.push(`(//${tagName}[text()='${text}'])[${position}]`);
      }
    }
    
    return xpaths;
  }

  private static getContainsXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const attributes = ['class', 'id', 'name', 'data-testid', 'role', 'title', 'placeholder'];
    
    attributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        // Simple contains
        xpaths.push(`//${tagName}[contains(@${attr}, '${value}')]`);
        
        // Case-insensitive contains
        xpaths.push(`//${tagName}[contains(translate(@${attr}, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${value.toLowerCase()}')]`);
        
        // Starts-with
        xpaths.push(`//${tagName}[starts-with(@${attr}, '${value}')]`);
        
        // Ends-with (if supported)
        xpaths.push(`//${tagName}[substring(@${attr}, string-length(@${attr}) - string-length('${value}') + 1) = '${value}']`);
      }
    });

    return xpaths;
  }

  private static getAxesBasedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const parentElement = element.parentElement;
    const parentTag = parentElement?.tagName.toLowerCase();

    if (parentTag) {
      // Parent-child relationship
      xpaths.push(`//${parentTag}/${tagName}`);
      
      // Parent with attributes
      const parentId = parentElement?.getAttribute('id');
      const parentClass = parentElement?.getAttribute('class');
      if (parentId) {
        xpaths.push(`//${parentTag}[@id='${parentId}']/${tagName}`);
      }
      if (parentClass) {
        xpaths.push(`//${parentTag}[contains(@class, '${parentClass}')]/${tagName}`);
      }

      // Following and preceding siblings
      xpaths.push(`//${tagName}[preceding-sibling::*[1][self::${tagName}]]`);
      xpaths.push(`//${tagName}[following-sibling::*[1][self::${tagName}]]`);
    }

    // Ancestor with specific attributes
    const ancestors = this.getAncestorsWithAttributes(element);
    ancestors.forEach(ancestor => {
      xpaths.push(ancestor);
    });

    return xpaths;
  }

  private static getLogicalXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim();
    const attributes = Array.from(element.attributes);

    // Combine multiple attributes with AND
    const attrConditions = attributes
      .filter(attr => attr.value)
      .map(attr => `@${attr.name}='${attr.value}'`);

    if (attrConditions.length >= 2) {
      xpaths.push(`//${tagName}[${attrConditions.slice(0, 2).join(' and ')}]`);
      xpaths.push(`//${tagName}[${attrConditions.slice(0, 3).join(' and ')}]`);
    }

    // Combine attributes with OR
    if (attrConditions.length >= 2) {
      xpaths.push(`//${tagName}[${attrConditions.slice(0, 2).join(' or ')}]`);
    }

    // Combine text and attributes
    if (text) {
      attributes.forEach(attr => {
        if (attr.value) {
          xpaths.push(`//${tagName}[text()='${text}' and @${attr.name}='${attr.value}']`);
          xpaths.push(`//${tagName}[contains(text(), '${text}') or @${attr.name}='${attr.value}']`);
        }
      });
    }

    return xpaths;
  }

  private static getCombinedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim();
    const className = element.getAttribute('class');
    const id = element.getAttribute('id');

    // Combine tag, class, and text
    if (text && className) {
      xpaths.push(`//${tagName}[contains(@class, '${className}')][normalize-space()='${text}']`);
      xpaths.push(`//${tagName}[contains(@class, '${className}') and contains(text(), '${text}')]`);
    }

    // Combine multiple attributes with position
    if (className && id) {
      const position = this.getElementPosition(element);
      xpaths.push(`(//${tagName}[@id='${id}' and contains(@class, '${className}')])[${position}]`);
    }

    // Combine parent and child attributes
    const parentElement = element.parentElement;
    if (parentElement && className) {
      const parentTag = parentElement.tagName.toLowerCase();
      const parentClass = parentElement.getAttribute('class');
      if (parentClass) {
        xpaths.push(`//${parentTag}[contains(@class, '${parentClass}')]/${tagName}[contains(@class, '${className}')]`);
      }
    }

    return xpaths;
  }

  private static getElementPosition(element: Element): number {
    const tagName = element.tagName.toLowerCase();
    const siblings = element.parentElement?.querySelectorAll(tagName);
    if (!siblings) return 0;
    return Array.from(siblings).indexOf(element) + 1;
  }

  private static getAncestorsWithAttributes(element: Element): string[] {
    const xpaths: string[] = [];
    let current = element.parentElement;
    const tagName = element.tagName.toLowerCase();
    let path = `//${tagName}`;

    while (current && current.tagName !== 'BODY') {
      const currentTag = current.tagName.toLowerCase();
      const id = current.getAttribute('id');
      const className = current.getAttribute('class');

      if (id) {
        xpaths.push(`//${currentTag}[@id='${id}']${path}`);
      }
      if (className) {
        xpaths.push(`//${currentTag}[contains(@class, '${className}')]${path}`);
      }

      path = `/${currentTag}${path}`;
      current = current.parentElement;
    }

    return xpaths;
  }

  public static generateXPaths(html: string, language: string = 'en'): XPathResultType[] {
    const doc = this.parseHTML(html);
    const element = doc.body.firstElementChild;
    
    if (!element) return [];

    const results: XPathResultType[] = [];
    const addResults = (xpaths: string[], type: XPathResultType['type'], reliability: number) => {
      xpaths.forEach(xpath => {
        if (this.validateXPath(xpath, html)) {
          results.push({
            xpath,
            type,
            description: translations[language as keyof typeof translations].descriptions[type],
            reliability
          });
        }
      });
    };

    // Generate all types of XPaths
    addResults(this.getAttributeBasedXPath(element), 'attribute', 0.95);
    addResults(this.getTextBasedXPath(element), 'text-based', 0.9);
    addResults(this.getContainsXPath(element), 'contains', 0.85);
    addResults(this.getAxesBasedXPath(element), 'axes', 0.8);
    addResults(this.getLogicalXPath(element), 'logical', 0.9);
    addResults(this.getCombinedXPath(element), 'combined', 0.95);

    // Sort by reliability and remove duplicates
    return Array.from(new Map(results.map(item => [item.xpath, item]))
      .values())
      .sort((a, b) => b.reliability - a.reliability);
  }

  public static validateXPath(xpath: string, html: string): boolean {
    const doc = this.parseHTML(html);
    try {
      const result = document.evaluate(
        xpath,
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      return result.iterateNext() !== null;
    } catch {
      return false;
    }
  }
}