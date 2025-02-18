export interface XPathResultType {
  xpath: string;
  type: 'attribute' | 'text-based' | 'contains' | 'axes' | 'logical' | 'combined';
  description: string;
  reliability: number;
}

export interface ElementLocatorResult {
  selector: string;
  type: 'id' | 'class' | 'xpath';
  description: string;
  reliability: number;
}

export interface HTMLElement {
  tagName: string;
  attributes: { [key: string]: string };
  textContent: string;
  children: HTMLElement[];
  parent?: HTMLElement;
  index?: number;
}