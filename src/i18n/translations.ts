export const translations = {
  en: {
    title: 'Code Tools',
    htmlFragmentLabel: 'HTML Fragment',
    htmlFragmentDescription: 'Paste a single HTML element to generate selectors for it',
    htmlFragmentPlaceholder: '<div class="example">Content</div>',
    generateButton: 'Generate Selectors',
    generatedXPathsTitle: 'Generated Selectors',
    noResultsMessage: 'Generated selectors will appear here',
    howToUseTitle: 'How to Use',
    howToUseSteps: [
      'Paste your HTML element in the text area',
      'Choose the selector type (XPath, ID, or Class)',
      'Click "Generate Selectors" to see all available options',
      'Copy any selector by clicking the copy icon'
    ],
    howToUseDescription: 'This tool helps you generate reliable selectors for web scraping, testing, and automation. Each selector comes with a reliability score and description to help you choose the best option for your needs.',
    copyright: '© 2025. All rights reserved by Gabriel Andrade',
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
    howToUseTitle: 'Como Usar',
    howToUseSteps: [
      'Cole seu elemento HTML na área de texto',
      'Escolha o tipo de seletor (XPath, ID ou Classe)',
      'Clique em "Gerar Seletores" para ver todas as opções disponíveis',
      'Copie qualquer seletor clicando no ícone de cópia'
    ],
    howToUseDescription: 'Esta ferramenta ajuda você a gerar seletores confiáveis para web scraping, testes e automação. Cada seletor vem com uma pontuação de confiabilidade e descrição para ajudar você a escolher a melhor opção para suas necessidades.',
    copyright: '© 2025. Todos os direitos reservados por Gabriel Andrade',
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