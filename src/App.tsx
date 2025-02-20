import React, { useState, useEffect } from 'react';
import { Code2, AlertCircle, CheckCircle2, Copy, Moon, Sun, Languages, Search, HelpCircle } from 'lucide-react';
import { XPathGenerator } from './utils/xpathGenerator';
import { ElementLocator } from './utils/elementLocator';
import type { XPathResultType, ElementLocatorResult } from './types';
import { translations } from './i18n/translations';

function App() {
  const [htmlInput, setHtmlInput] = useState('');
  const [results, setResults] = useState<(XPathResultType | ElementLocatorResult)[]>([]);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('language') || 'en'
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [locatorType, setLocatorType] = useState<'xpath' | 'id' | 'class'>('xpath');

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleGenerate = () => {
    try {
      if (!htmlInput) {
        setError(t.errorMessages.noHtml);
        return;
      }

      let newResults: (XPathResultType | ElementLocatorResult)[] = [];

      switch (locatorType) {
        case 'xpath':
          newResults = XPathGenerator.generateXPaths(htmlInput, language);
          break;
        case 'id':
          newResults = ElementLocator.locateById(htmlInput);
          break;
        case 'class':
          newResults = ElementLocator.locateByClass(htmlInput);
          break;
      }
      
      if (newResults.length === 0) {
        setError(t.errorMessages.noElement);
        return;
      }

      setResults(newResults);
      setError('');
    } catch (err) {
      setError(t.errorMessages.processing);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${darkMode ? 'dark bg-dark-bg' : 'bg-light-bg'}`}>
      <header className={`${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'} border-b shadow-modern sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className={`h-8 w-8 ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-light-text-primary'}`}>
                {t.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-dark-surface text-gray-300 hover:text-neon-primary hover:shadow-neon' 
                    : 'hover:bg-light-bg text-light-text-primary hover:text-vibrant-primary hover:shadow-modern'
                }`}
                aria-label="Toggle language"
              >
                <Languages className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-dark-surface text-gray-300 hover:text-neon-primary hover:shadow-neon' 
                    : 'hover:bg-light-bg text-light-text-primary hover:text-vibrant-primary hover:shadow-modern'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 hover:text-neon-primary transition-colors duration-200" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'} rounded-xl shadow-modern border p-6`}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="html" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-light-text-primary'}`}>
                    {t.htmlFragmentLabel}
                  </label>
                  <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-light-text-secondary'} mb-2`}>
                    {t.htmlFragmentDescription}
                  </div>
                  <textarea
                    id="html"
                    rows={10}
                    className={`mt-1 block w-full rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 ${
                      darkMode 
                        ? 'bg-dark-surface border-dark-border text-gray-100 focus:ring-neon-primary' 
                        : 'bg-light-surface border-light-border text-light-text-primary focus:ring-vibrant-primary'
                    }`}
                    placeholder={t.htmlFragmentPlaceholder}
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                  />
                </div>

                <div className="flex space-x-4">
                  <select
                    value={locatorType}
                    onChange={(e) => setLocatorType(e.target.value as 'xpath' | 'id' | 'class')}
                    className={`rounded-lg shadow-sm transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-dark-surface border-dark-border text-gray-100 focus:ring-neon-primary' 
                        : 'bg-light-surface border-light-border text-light-text-primary focus:ring-vibrant-primary'
                    }`}
                  >
                    <option value="xpath">XPath</option>
                    <option value="id">ID</option>
                    <option value="class">Class</option>
                  </select>

                  <button
                    onClick={handleGenerate}
                    className={`flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      darkMode
                        ? 'bg-neon-primary text-dark-bg hover:shadow-neon'
                        : 'bg-vibrant-primary text-light-surface hover:shadow-modern'
                    }`}
                  >
                    {t.generateButton}
                  </button>
                </div>

                {error && (
                  <div className={`rounded-lg p-4 ${
                    darkMode 
                      ? 'bg-red-900/30 border-red-800' 
                      : 'bg-red-50 border-red-200'
                  } border`}>
                    <div className="flex">
                      <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-400'}`} />
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                          {error}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-light-text-primary'} flex items-center`}>
                {t.generatedXPathsTitle}
              </h2>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`${
                    darkMode 
                      ? 'bg-dark-surface border-dark-border' 
                      : 'bg-light-surface border-light-border'
                  } shadow-modern rounded-xl p-4 border transition-all duration-200 hover:scale-102`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-light-text-secondary'}`}>
                      {'xpath' in result ? t.xpathTypes[result.type] : result.type}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <CheckCircle2 className={`h-5 w-5 ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'} mr-1`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-light-text-secondary'}`}>
                          {(result.reliability * 100).toFixed(0)}% {t.reliability}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('xpath' in result ? result.xpath : result.selector, index)}
                        className={`p-1 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-400 hover:text-neon-primary' 
                            : 'text-light-text-secondary hover:text-vibrant-primary'
                        }`}
                        aria-label="Copy selector"
                      >
                        {copiedIndex === index ? (
                          <span className={`text-sm ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'}`}>
                            {t.copied}
                          </span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <pre className={`rounded-lg p-3 text-sm overflow-x-auto ${
                    darkMode 
                      ? 'bg-dark-bg text-gray-300 border-dark-border' 
                      : 'bg-light-bg text-light-text-primary border-light-border'
                  } border`}>
                    {'xpath' in result ? result.xpath : result.selector}
                  </pre>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-light-text-secondary'}`}>
                    {result.description}
                  </p>
                </div>
              ))}
              {results.length === 0 && (
                <div className={`text-center py-12 rounded-xl border ${
                  darkMode 
                    ? 'bg-dark-surface border-dark-border text-gray-400' 
                    : 'bg-light-surface border-light-border text-light-text-secondary'
                }`}>
                  <p>{t.noResultsMessage}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'} rounded-xl shadow-modern border p-6 sticky top-24`}>
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className={`h-5 w-5 ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'}`} />
                <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-light-text-primary'}`}>
                  {t.howToUseTitle}
                </h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-light-text-secondary'} mb-4`}>
                {t.howToUseDescription}
              </p>
              <ol className="space-y-3">
                {t.howToUseSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      darkMode ? 'bg-dark-bg text-neon-primary' : 'bg-light-bg text-vibrant-primary'
                    } text-sm font-medium mr-3`}>
                      {index + 1}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-light-text-primary'}`}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className={`${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'} border-t mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-light-text-secondary'}`}>
            {t.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;