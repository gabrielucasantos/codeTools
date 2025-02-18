import React, { useState, useEffect } from 'react';
import { Code2, AlertCircle, CheckCircle2, Copy, Moon, Sun, Languages, Search } from 'lucide-react';
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
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-dark-bg' : 'bg-light-bg'}`}>
      <header className={`${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'} border-b shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className={`h-8 w-8 ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-dark-surface text-gray-300 hover:text-neon-primary hover:shadow-neon' 
                    : 'hover:bg-light-surface text-gray-600 hover:text-vibrant-primary hover:shadow-vibrant'
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
                    : 'hover:bg-light-surface text-gray-600 hover:text-vibrant-primary hover:shadow-vibrant'
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label htmlFor="html" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t.htmlFragmentLabel}
              </label>
              <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                {t.htmlFragmentDescription}
              </div>
              <textarea
                id="html"
                rows={10}
                className={`mt-1 block w-full rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 ${
                  darkMode 
                    ? 'bg-dark-surface border-dark-border text-gray-100 focus:ring-neon-primary' 
                    : 'bg-white border-light-border text-gray-900 focus:ring-vibrant-primary'
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
                    : 'bg-white border-light-border text-gray-900 focus:ring-vibrant-primary'
                }`}
              >
                <option value="xpath">XPath</option>
                <option value="id">ID</option>
                <option value="class">Class</option>
              </select>

              <button
                onClick={handleGenerate}
                className={`flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-200 ${
                  darkMode
                    ? 'bg-neon-primary text-dark-bg hover:shadow-neon'
                    : 'bg-vibrant-primary text-white hover:shadow-vibrant'
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

          <div className="space-y-4">
            <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {t.generatedXPathsTitle}
            </h2>
            {results.map((result, index) => (
              <div
                key={index}
                className={`${
                  darkMode 
                    ? 'bg-dark-surface border-dark-border' 
                    : 'bg-white border-light-border'
                } shadow-lg rounded-lg p-4 border transition-all duration-200 hover:scale-102 ${
                  darkMode ? 'hover:shadow-neon' : 'hover:shadow-vibrant'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {'xpath' in result ? t.xpathTypes[result.type] : result.type}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CheckCircle2 className={`h-5 w-5 ${darkMode ? 'text-neon-primary' : 'text-vibrant-primary'} mr-1`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {(result.reliability * 100).toFixed(0)}% {t.reliability}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy('xpath' in result ? result.xpath : result.selector, index)}
                      className={`p-1 rounded-lg transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-400 hover:text-neon-primary' 
                          : 'text-gray-600 hover:text-vibrant-primary'
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
                    : 'bg-light-surface text-gray-800 border-light-border'
                } border`}>
                  {'xpath' in result ? result.xpath : result.selector}
                </pre>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {result.description}
                </p>
              </div>
            ))}
            {results.length === 0 && (
              <div className={`text-center py-12 rounded-lg border ${
                darkMode 
                  ? 'bg-dark-surface border-dark-border text-gray-400' 
                  : 'bg-white border-light-border text-gray-500'
              }`}>
                <p>{t.noResultsMessage}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;