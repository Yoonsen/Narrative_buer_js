import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const SelectorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SelectorTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.125rem;
`;

const ResultsCount = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 2rem 0;
`;

const SelectedDocInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
`;

const DocTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const DocMeta = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    minHeight: '42px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    '&:hover': {
      borderColor: '#9ca3af'
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    padding: '12px 16px'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#374151'
  })
};

const DocumentSelector = ({ corpus, selectedDocument, onSelectDocument, isLoading }) => {
  // Transform corpus data for react-select
  const options = corpus.map(doc => ({
    value: doc,
    label: `${doc.authors?.join(', ') || 'Ukjent forfatter'} - ${doc.title} (${doc.year || 'Ukjent år'})`
  }));

  const selectedOption = selectedDocument ? {
    value: selectedDocument,
    label: `${selectedDocument.authors?.join(', ') || 'Ukjent forfatter'} - ${selectedDocument.title} (${selectedDocument.year || 'Ukjent år'})`
  } : null;

  const handleChange = (option) => {
    onSelectDocument(option ? option.value : null);
  };

  if (isLoading) {
    return (
      <SelectorCard>
        <SelectorTitle>Dokumenter</SelectorTitle>
        <EmptyState>Søker etter dokumenter...</EmptyState>
      </SelectorCard>
    );
  }

  return (
    <SelectorCard>
      <SelectorTitle>Velg dokument</SelectorTitle>
      
      {corpus.length > 0 && (
        <ResultsCount>
          {corpus.length} dokument{corpus.length !== 1 ? 'er' : ''} funnet
        </ResultsCount>
      )}

      {corpus.length === 0 ? (
        <EmptyState>
          Ingen dokumenter funnet. Prøv et annet søk.
        </EmptyState>
      ) : (
        <>
          <Select
            options={options}
            value={selectedOption}
            onChange={handleChange}
            styles={customSelectStyles}
            placeholder="Velg et dokument fra listen..."
            noOptionsMessage={() => "Ingen dokumenter funnet"}
            isClearable
            isSearchable
            maxMenuHeight={300}
          />

          {selectedDocument && (
            <SelectedDocInfo>
              <DocTitle>{selectedDocument.title}</DocTitle>
              <DocMeta>
                <div>
                  <strong>Forfatter:</strong> {selectedDocument.authors?.join(', ') || 'Ukjent forfatter'}
                </div>
                <div>
                  <strong>År:</strong> {selectedDocument.year || 'Ukjent år'}
                </div>
                <div>
                  <strong>URN:</strong> {selectedDocument.urn}
                </div>
              </DocMeta>
            </SelectedDocInfo>
          )}
        </>
      )}
    </SelectorCard>
  );
};

export default DocumentSelector;
