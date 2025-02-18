import DOMPurify from 'dompurify';
import { ElementLocatorResult } from '../types';

export class ElementLocator {
  private static parseHTML(html: string): Document {
    const cleanHTML = DOMPurify.sanitize(html);
    const parser = new DOMParser();
    return parser.parseFromString(cleanHTML, 'text/html');
  }

  public static locateById(html: string): ElementLocatorResult[] {
    const doc = this.parseHTML(html);
    const element = doc.body.firstElementChild;
    const results: ElementLocatorResult[] = [];

    if (!element) return results;

    const id = element.getAttribute('id');
    if (id) {
      results.push({
        selector: `#${id}`,
        type: 'id',
        description: 'Localiza o elemento pelo ID',
        reliability: 1.0,
      });
    }

    return results;
  }

  public static locateByClass(html: string): ElementLocatorResult[] {
    const doc = this.parseHTML(html);
    const element = doc.body.firstElementChild;
    const results: ElementLocatorResult[] = [];

    if (!element) return results;

    const className = element.getAttribute('class');
    if (className) {
      const classes = className.split(' ').filter(c => c.trim());
      classes.forEach(cls => {
        results.push({
          selector: `.${cls}`,
          type: 'class',
          description: 'Localiza o elemento pela classe CSS',
          reliability: 0.8,
        });
      });

      if (classes.length > 1) {
        results.push({
          selector: `.${classes.join('.')}`,
          type: 'class',
          description: 'Localiza o elemento por múltiplas classes',
          reliability: 0.9,
        });
      }
    }

    return results;
  }

  public static validateSelector(selector: string, html: string): boolean {
    const doc = this.parseHTML(html);
    try {
      return doc.querySelector(selector) !== null;
    } catch {
      return false;
    }
  }
}