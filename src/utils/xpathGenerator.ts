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
    
    // ID-based
    const id = element.getAttribute('id');
    if (id) xpaths.push(`//*[@id='${id}']`);

    // Class-based
    const className = element.getAttribute('class');
    if (className) {
      const classes = className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        xpaths.push(`//*[contains(@class, '${classes[0]}')]`);
        if (classes.length > 1) {
          xpaths.push(`//*[${classes.map(c => `contains(@class, '${c}')`).join(' and ')}]`);
        }
      }
    }

    // Other attributes
    ['name', 'data-testid', 'role', 'aria-label'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) xpaths.push(`//*[@${attr}='${value}']`);
    });

    return xpaths;
  }

  private static getTextBasedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const text = element.textContent?.trim();
    
    if (text) {
      // Exact text match
      xpaths.push(`//*[text()='${text}']`);
      
      // Text contains with full text
      xpaths.push(`//*[contains(text(), '${text}')]`);
      
      // Normalize space
      xpaths.push(`//*[normalize-space()='${text}']`);
    }
    
    return xpaths;
  }

  private static getContainsXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const attributes = ['class', 'id', 'name', 'data-testid', 'role'];
    
    attributes.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        xpaths.push(`//*[contains(@${attr}, '${value}')]`);
      }
    });

    return xpaths;
  }

  private static getAxesBasedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();

    // Following-sibling
    xpaths.push(`//*[following-sibling::${tagName}]`);
    
    // Preceding-sibling
    xpaths.push(`//*[preceding-sibling::${tagName}]`);
    
    // Parent
    const parentTag = element.parentElement?.tagName.toLowerCase();
    if (parentTag) {
      xpaths.push(`//${parentTag}//${tagName}`);
    }
    
    // Ancestor
    xpaths.push(`//*[ancestor::${tagName}]`);

    return xpaths;
  }

  private static getLogicalXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim();
    const className = element.getAttribute('class');

    if (text && className) {
      xpaths.push(`//*[contains(@class, '${className}') or contains(text(), '${text}')]`);
      xpaths.push(`//*[contains(@class, '${className}') and contains(text(), '${text}')]`);
    }

    const attributes = Array.from(element.attributes)
      .filter(attr => attr.value)
      .map(attr => `@${attr.name}='${attr.value}'`);

    if (attributes.length >= 2) {
      xpaths.push(`//${tagName}[${attributes.slice(0, 2).join(' and ')}]`);
      xpaths.push(`//${tagName}[${attributes.slice(0, 2).join(' or ')}]`);
    }

    return xpaths;
  }

  private static getCombinedXPath(element: Element): string[] {
    const xpaths: string[] = [];
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim();
    const className = element.getAttribute('class');

    if (text && className) {
      // Combine contains with text()
      xpaths.push(`//${tagName}[contains(@class, '${className}')][text()='${text}']`);
      
      // Combine multiple conditions
      xpaths.push(`//${tagName}[contains(@class, '${className}') and normalize-space()='${text}']`);
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

    // Attribute-based XPaths
    addResults(this.getAttributeBasedXPath(element), 'attribute', 0.9);

    // Text-based XPaths
    addResults(this.getTextBasedXPath(element), 'text-based', 0.8);

    // Contains XPaths
    addResults(this.getContainsXPath(element), 'contains', 0.7);

    // Axes-based XPaths
    addResults(this.getAxesBasedXPath(element), 'axes', 0.6);

    // Logical operator XPaths
    addResults(this.getLogicalXPath(element), 'logical', 0.8);

    // Combined XPaths
    addResults(this.getCombinedXPath(element), 'combined', 0.9);

    return results.sort((a, b) => b.reliability - a.reliability);
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