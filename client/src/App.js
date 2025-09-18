import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DocumentSelector from './components/DocumentSelector';
import DispersionChart from './components/DispersionChart';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { searchCorpus, getDispersion } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding: 2rem 0;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    fromYear: 1980,
    toYear: 2020,
    window: 2500,
    stepSize: 100
  });
  
  const [corpus, setCorpus] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [wordsToAnalyze, setWordsToAnalyze] = useState('');
  const [dispersionData, setDispersionData] = useState(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Search for corpus when search parameters change
  const handleSearch = async (params) => {
    setIsSearching(true);
    setError(null);
    setCorpus([]);
    setSelectedDocument(null);
    setDispersionData(null);
    
    try {
      const response = await searchCorpus({
        freetext: params.keywords || null,
        from_year: params.fromYear,
        to_year: params.toYear
      });
      
      if (response.success) {
        setCorpus(response.data);
        setSearchParams(params);
      } else {
        setError('Feil ved søk i korpus');
      }
    } catch (err) {
      setError('Kunne ikke hente dokumenter. Prøv igjen senere.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Analyze dispersion when document and words are selected
  const handleAnalyze = async () => {
    if (!selectedDocument || !wordsToAnalyze.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setDispersionData(null);

    try {
      const response = await getDispersion({
        urn: selectedDocument.urn,
        words: wordsToAnalyze,
        window: searchParams.window,
        pr: searchParams.stepSize
      });

      if (response.success) {
        setDispersionData(response.data);
      } else {
        setError('Feil ved analyse av ordspredning');
      }
    } catch (err) {
      setError(`Noe gikk galt med ${selectedDocument.title}. Prøv et annet dokument.`);
      console.error('Dispersion error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when document or words change
  useEffect(() => {
    if (selectedDocument && wordsToAnalyze.trim()) {
      handleAnalyze();
    }
  }, [selectedDocument, wordsToAnalyze, searchParams.window, searchParams.stepSize]);

  return (
    <AppContainer>
      <Header />
      
      <MainContent>
        <ContentGrid>
          <Sidebar>
            <SearchForm
              searchParams={searchParams}
              onSearch={handleSearch}
              isLoading={isSearching}
            />
            
            <DocumentSelector
              corpus={corpus}
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
              isLoading={isSearching}
            />
          </Sidebar>

          <ChartContainer>
            {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">
                Angi ord som skal telles (separert med komma)
              </label>
              <input
                type="text"
                className="form-input"
                value={wordsToAnalyze}
                onChange={(e) => setWordsToAnalyze(e.target.value)}
                placeholder="f.eks: kjærlighet, sorg, glede"
                disabled={!selectedDocument}
              />
            </div>

            {isAnalyzing && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <LoadingSpinner />
              </div>
            )}

            {dispersionData && !isAnalyzing && (
              <DispersionChart
                data={dispersionData.dispersion}
                metadata={dispersionData.metadata}
              />
            )}

            {!selectedDocument && !isAnalyzing && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, color: '#6b7280' }}>
                Velg et dokument for å starte analysen
              </div>
            )}
          </ChartContainer>
        </ContentGrid>
      </MainContent>
    </AppContainer>
  );
}

export default App;
