import React, { useState, useEffect } from 'react';
import { Code2, AlertCircle, CheckCircle2, Copy, Moon, Sun, Languages } from 'lucide-react';
import { XPathGenerator } from './utils/xpathGenerator';
import type { XPathResultType } from './types';
import { translations } from './i18n/translations';

function App() {
  const [htmlInput, setHtmlInput] = useState('');
  const [results, setResults] = useState<XPathResultType[]>([]);
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

      const xpaths = XPathGenerator.generateXPaths(htmlInput, language);
      
      if (xpaths.length === 0) {
        setError(t.errorMessages.noElement);
        return;
      }

      setResults(xpaths);
      setError('');
    } catch (err) {
      setError(t.errorMessages.processing);
    }
  };

  const handleCopy = async (xpath: string, index: number) => {
    await navigator.clipboard.writeText(xpath);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Toggle language"
              >
                <Languages className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="text-gray-300" />
                ) : (
                  <Moon className="text-gray-600" />
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
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                  ${darkMode 
                    ? 'bg-gray-800 border-gray-700 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder={t.htmlFragmentPlaceholder}
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.generateButton}
            </button>

            {error && (
              <div className={`rounded-md ${darkMode ? 'bg-red-900' : 'bg-red-50'} p-4`}>
                <div className="flex">
                  <AlertCircle className={`h-5 w-5 ${darkMode ? 'text-red-300' : 'text-red-400'}`} />
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
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow rounded-lg p-4 border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t.xpathTypes[result.type]}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {(result.reliability * 100).toFixed(0)}% {t.reliability}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(result.xpath, index)}
                      className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      aria-label="Copy XPath"
                    >
                      {copiedIndex === index ? (
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {t.copied}
                        </span>
                      ) : (
                        <Copy className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      )}
                    </button>
                  </div>
                </div>
                <pre className={`rounded p-2 text-sm overflow-x-auto ${
                  darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
                }`}>
                  {result.xpath}
                </pre>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {result.description}
                </p>
              </div>
            ))}
            {results.length === 0 && (
              <div className={`text-center py-12 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
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