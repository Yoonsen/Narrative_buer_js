import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 429) {
      throw new Error('For mange forespørsler. Prøv igjen senere.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Serverfeil. Prøv igjen senere.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Noe gikk galt. Sjekk nettverkstilkoblingen og prøv igjen.');
  }
);

/**
 * Search for corpus documents
 */
export const searchCorpus = async ({ freetext, title, from_year, to_year }) => {
  const params = new URLSearchParams();
  
  if (freetext) params.append('freetext', freetext);
  if (title) params.append('title', title);
  if (from_year) params.append('from_year', from_year.toString());
  if (to_year) params.append('to_year', to_year.toString());

  return await api.get(`/corpus?${params.toString()}`);
};

/**
 * Get word dispersion for a document
 */
export const getDispersion = async ({ urn, words, window, pr }) => {
  const params = new URLSearchParams({
    urn,
    words: Array.isArray(words) ? words.join(',') : words,
    window: window.toString(),
    pr: pr.toString()
  });

  return await api.get(`/dispersion?${params.toString()}`);
};

/**
 * Get document metadata
 */
export const getDocumentMetadata = async (urn) => {
  return await api.get(`/document/${encodeURIComponent(urn)}`);
};

/**
 * Get search suggestions
 */
export const getSearchSuggestions = async (query) => {
  const params = new URLSearchParams({ query });
  return await api.get(`/suggestions?${params.toString()}`);
};

/**
 * Health check
 */
export const healthCheck = async () => {
  return await api.get('/health');
};

export default api;
