export const translations = {
  en: {
    title: 'Code Tools',
    htmlFragmentLabel: 'HTML Fragment',
    htmlFragmentDescription: 'Paste a single HTML element to generate selectors for it',
    htmlFragmentPlaceholder: '<div class="example">Content</div>',
    generateButton: 'Generate Selectors',
    generatedXPathsTitle: 'Generated Selectors',
    noResultsMessage: 'Generated selectors will appear here',
    errorMessages: {
      noHtml: 'Please provide an HTML fragment',
      noElement: 'No valid element found in the HTML fragment',
      processing: 'Error processing HTML. Please check your input.',
    },
    copied: 'Copied!',
    xpathTypes: {
      attribute: 'Attribute-based',
      'text-based': 'Text-based',
      contains: 'Contains',
      axes: 'Axes-based',
      logical: 'Logical operators',
      combined: 'Combined',
    },
    reliability: 'reliable',
    descriptions: {
      attribute: 'Uses element attributes for precise location',
      'text-based': 'Locates element by its text content',
      contains: 'Uses partial matching for flexible selection',
      axes: 'Navigates through document relationships',
      logical: 'Combines conditions with AND/OR operators',
      combined: 'Uses multiple strategies for robust selection'
    }
  },
  pt: {
    title: 'Ferramentas de Código',
    htmlFragmentLabel: 'Fragmento HTML',
    htmlFragmentDescription: 'Cole um elemento HTML para gerar seletores para ele',
    htmlFragmentPlaceholder: '<div class="exemplo">Conteúdo</div>',
    generateButton: 'Gerar Seletores',
    generatedXPathsTitle: 'Seletores Gerados',
    noResultsMessage: 'Os seletores gerados aparecerão aqui',
    errorMessages: {
      noHtml: 'Por favor, forneça um fragmento HTML',
      noElement: 'Nenhum elemento válido encontrado no fragmento HTML',
      processing: 'Erro ao processar HTML. Por favor, verifique sua entrada.',
    },
    copied: 'Copiado!',
    xpathTypes: {
      attribute: 'Baseado em atributos',
      'text-based': 'Baseado em texto',
      contains: 'Contém',
      axes: 'Baseado em eixos',
      logical: 'Operadores lógicos',
      combined: 'Combinado',
    },
    reliability: 'confiável',
    descriptions: {
      attribute: 'Usa atributos do elemento para localização precisa',
      'text-based': 'Localiza o elemento pelo seu conteúdo de texto',
      contains: 'Usa correspondência parcial para seleção flexível',
      axes: 'Navega através das relações do documento',
      logical: 'Combina condições com operadores E/OU',
      combined: 'Usa múltiplas estratégias para seleção robusta'
    }
  },
};