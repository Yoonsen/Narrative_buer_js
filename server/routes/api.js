const express = require('express');
const router = express.Router();
const dhlabService = require('../services/dhlabService');

// Get corpus based on search parameters
router.get('/corpus', async (req, res) => {
  try {
    const { freetext, title, from_year, to_year } = req.query;
    
    // Validate parameters
    const fromYear = parseInt(from_year) || 1900;
    const toYear = parseInt(to_year) || 2020;
    
    if (fromYear < 1800 || fromYear > 2022 || toYear < 1800 || toYear > 2022) {
      return res.status(400).json({ 
        error: 'Year range must be between 1800 and 2022' 
      });
    }
    
    if (fromYear > toYear) {
      return res.status(400).json({ 
        error: 'from_year must be less than or equal to to_year' 
      });
    }

    const corpus = await dhlabService.getCorpus({
      freetext: freetext || null,
      title: title || null,
      fromYear,
      toYear
    });

    res.json({
      success: true,
      data: corpus,
      count: corpus.length
    });
  } catch (error) {
    console.error('Error fetching corpus:', error);
    res.status(500).json({ 
      error: 'Failed to fetch corpus',
      message: error.message
    });
  }
});

// Get word dispersion for a document
router.get('/dispersion', async (req, res) => {
  try {
    const { urn, words, window, pr } = req.query;
    
    if (!urn) {
      return res.status(400).json({ 
        error: 'URN parameter is required' 
      });
    }
    
    if (!words) {
      return res.status(400).json({ 
        error: 'Words parameter is required' 
      });
    }

    // Parse and validate parameters
    const wordbag = words.split(',').map(w => w.trim()).filter(w => w.length > 0);
    const windowSize = parseInt(window) || 2500;
    const stepSize = parseInt(pr) || 100;
    
    if (windowSize < 300) {
      return res.status(400).json({ 
        error: 'Window size must be at least 300' 
      });
    }
    
    if (stepSize < 100) {
      return res.status(400).json({ 
        error: 'Step size must be at least 100' 
      });
    }

    const dispersion = await dhlabService.getDispersion({
      urn,
      wordbag,
      window: windowSize,
      pr: stepSize
    });

    res.json({
      success: true,
      data: dispersion,
      metadata: {
        urn,
        words: wordbag,
        window: windowSize,
        step: stepSize
      }
    });
  } catch (error) {
    console.error('Error calculating dispersion:', error);
    res.status(500).json({ 
      error: 'Failed to calculate dispersion',
      message: error.message
    });
  }
});

// Get document metadata
router.get('/document/:urn', async (req, res) => {
  try {
    const { urn } = req.params;
    
    if (!urn) {
      return res.status(400).json({ 
        error: 'URN parameter is required' 
      });
    }

    const metadata = await dhlabService.getDocumentMetadata(urn);

    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    res.status(500).json({ 
      error: 'Failed to fetch document metadata',
      message: error.message
    });
  }
});

// Search suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await dhlabService.getSearchSuggestions(query);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch suggestions',
      message: error.message
    });
  }
});

module.exports = router;
