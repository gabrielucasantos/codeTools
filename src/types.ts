export interface XPathResultType {
  xpath: string;
  type: 'attribute' | 'text-based' | 'contains' | 'axes' | 'logical' | 'combined';
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

export interface Translations {
  title: string;
  htmlFragmentLabel: string;
  htmlFragmentDescription: string;
  htmlFragmentPlaceholder: string;
  generateButton: string;
  generatedXPathsTitle: string;
  noResultsMessage: string;
  errorMessages: {
    noHtml: string;
    noElement: string;
    processing: string;
  };
  copied: string;
  xpathTypes: {
    attribute: string;
    'text-based': string;
    contains: string;
    axes: string;
    logical: string;
    combined: string;
  };
  reliability: string;
  descriptions: {
    attribute: string;
    'text-based': string;
    contains: string;
    axes: string;
    logical: string;
    combined: string;
  };
}