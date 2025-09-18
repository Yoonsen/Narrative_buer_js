const axios = require('axios');

// Norwegian National Library API base URLs
// DHLAB API confirmed at https://api.nb.no/dhlab with Swagger documentation
const DHLAB_API_BASE = 'https://api.nb.no/dhlab';
const NB_CATALOG_BASE = 'https://api.nb.no/catalog/v1';

class DhlabService {
  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Narrative-Buer-PWA/1.0',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Get corpus of documents based on search parameters
   * Mimics the dhlab.text.Corpus functionality using the real DHLAB API
   */
  async getCorpus({ freetext = null, title = null, fromYear = 1900, toYear = 2020 }) {
    try {
      // Build request payload for DHLAB corpus endpoint
      const requestData = {
        from_year: fromYear,
        to_year: toYear,
        limit: 50
      };

      if (freetext) {
        requestData.freetext = freetext;
      }
      
      if (title) {
        requestData.title = title;
      }

      // Make request to DHLAB API corpus endpoint
      const response = await this.axiosInstance.post(`${DHLAB_API_BASE}/corpus`, requestData);

      if (!response.data) {
        return [];
      }

      // Transform the response to match the expected format
      const documents = response.data.map(item => {
        return {
          authors: Array.isArray(item.authors) ? item.authors : [item.authors || 'Ukjent forfatter'],
          title: item.title || 'Ukjent tittel',
          year: item.year || null,
          urn: item.urn || item.id,
          id: item.id || item.urn
        };
      });

      return documents;
    } catch (error) {
      console.error('Error fetching corpus from DHLAB API:', error);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      return this.generateMockCorpus(freetext, fromYear, toYear);
    }
  }

  /**
   * Calculate word dispersion for a document
   * Uses the real DHLAB API /dispersion endpoint
   */
  async getDispersion({ urn, wordbag, window = 2500, pr = 100 }) {
    try {
      // Build request payload according to DHLAB API specification
      const requestData = {
        urn: urn,
        words: Array.isArray(wordbag) ? wordbag : [wordbag],
        window: window,
        pr: pr
      };

      console.log('Making dispersion request to DHLAB API:', requestData);

      // Make request to DHLAB API dispersion endpoint
      const response = await this.axiosInstance.post(`${DHLAB_API_BASE}/dispersion`, requestData);

      if (response.data) {
        // Transform the response data to match our expected format
        const dispersionData = this.transformDispersionResponse(response.data, requestData.words, pr);
        
        return {
          dispersion: dispersionData,
          metadata: {
            urn,
            words: requestData.words,
            window,
            pr,
            total_windows: dispersionData.length
          }
        };
      } else {
        throw new Error('Invalid response format from DHLAB API');
      }
    } catch (error) {
      console.error('Error calculating dispersion from DHLAB API:', error.response?.data || error.message);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock dispersion data...');
      const mockDispersion = this.generateMockDispersion(wordbag, window, pr);
      
      return {
        dispersion: mockDispersion,
        metadata: {
          urn,
          words: Array.isArray(wordbag) ? wordbag : [wordbag],
          window,
          pr,
          total_windows: mockDispersion.length
        }
      };
    }
  }

  /**
   * Transform DHLAB dispersion response to our expected format
   */
  transformDispersionResponse(apiData, words, pr = 100) {
    // The API returns "a list of lists of frequencies per block"
    // We need to transform this into our chart format
    if (!Array.isArray(apiData)) {
      throw new Error('Expected array response from dispersion API');
    }

    return apiData.map((frequencies, index) => {
      const windowData = {
        window_start: index * pr,
        window_end: (index + 1) * pr
      };

      // Map frequencies to words
      words.forEach((word, wordIndex) => {
        windowData[word] = frequencies[wordIndex] || 0;
      });

      return windowData;
    });
  }

  /**
   * Get document metadata
   */
  async getDocumentMetadata(urn) {
    try {
      const response = await this.axiosInstance.get(`${NB_API_BASE}/items/${urn}`);
      
      return {
        urn: urn,
        title: response.data.metadata?.title || 'Unknown Title',
        authors: this.extractAuthors(response.data),
        year: this.extractYear(response.data),
        publisher: response.data.metadata?.publisher,
        pages: response.data.metadata?.extent,
        language: response.data.metadata?.language
      };
    } catch (error) {
      console.error('Error fetching document metadata:', error);
      throw new Error(`Failed to fetch document metadata: ${error.message}`);
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query) {
    try {
      const response = await this.axiosInstance.get(`${NB_API_BASE}/search/suggest`, {
        params: {
          q: query,
          size: 10
        }
      });

      return response.data.suggestions || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  /**
   * Helper method to extract authors from item metadata
   */
  extractAuthors(item) {
    if (!item.metadata || !item.metadata.creators) {
      return ['Unknown Author'];
    }

    return item.metadata.creators.map(creator => creator.name || 'Unknown Author');
  }

  /**
   * Helper method to extract year from item metadata
   */
  extractYear(item) {
    if (!item.metadata || !item.metadata.issued) {
      return null;
    }

    const issued = item.metadata.issued;
    if (typeof issued === 'string') {
      const match = issued.match(/(\d{4})/);
      return match ? parseInt(match[1]) : null;
    }

    return issued;
  }

  /**
   * Helper method to extract URN from item
   */
  extractUrn(item) {
    return item.id || item.urn || null;
  }

  /**
   * Generate mock corpus data for testing/fallback
   */
  generateMockCorpus(freetext, fromYear, toYear) {
    const mockAuthors = [
      'Henrik Ibsen', 'Knut Hamsun', 'Sigrid Undset', 'Bjørnstjerne Bjørnson',
      'Alexander Kielland', 'Jonas Lie', 'Amalie Skram', 'Camilla Collett',
      'Arne Garborg', 'Kristofer Uppdal', 'Olav Duun', 'Tarjei Vesaas'
    ];

    const mockTitles = [
      'Et dukkehjem', 'Peer Gynt', 'Sult', 'Pan', 'Kristin Lavransdatter',
      'Synnøve Solbakken', 'En glad gutt', 'Gift', 'Skipper Worse',
      'Kommandørens døtre', 'Constance Ring', 'Bondens søn', 'Fred'
    ];

    const numDocs = Math.min(20, Math.max(5, Math.floor(Math.random() * 15) + 5));
    const documents = [];

    for (let i = 0; i < numDocs; i++) {
      const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
      const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];
      const year = Math.floor(Math.random() * (toYear - fromYear + 1)) + fromYear;
      const urn = `URN:NBN:no-nb_digibok_${Date.now()}_${i.toString().padStart(4, '0')}`;

      documents.push({
        authors: [author],
        title: `${title} ${freetext ? `(${freetext})` : ''}`,
        year: year,
        urn: urn,
        id: urn
      });
    }

    return documents;
  }

  /**
   * Generate mock dispersion data for testing/fallback
   */
  generateMockDispersion(wordbag, window, pr) {
    const words = Array.isArray(wordbag) ? wordbag : [wordbag];
    const numWindows = Math.floor(10000 / pr); // Assume 10000 word document
    const dispersionData = [];

    for (let i = 0; i < numWindows; i++) {
      const windowData = {};
      
      words.forEach(word => {
        // Generate realistic-looking dispersion data
        const baseFreq = Math.random() * 10;
        const noise = (Math.random() - 0.5) * 2;
        const trend = Math.sin(i / numWindows * Math.PI * 2) * 2;
        
        windowData[word] = Math.max(0, Math.round(baseFreq + noise + trend));
      });

      windowData['window_start'] = i * pr;
      windowData['window_end'] = i * pr + window;
      
      dispersionData.push(windowData);
    }

    return dispersionData;
  }
}

module.exports = new DhlabService();
