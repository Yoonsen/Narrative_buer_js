import React, { useState } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.125rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SliderContainer = styled.div`
  margin: 1rem 0;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SliderValue = styled.span`
  font-weight: 500;
  color: #3b82f6;
`;

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 20px;
`;

const StyledThumb = styled.div`
  height: 20px;
  line-height: 20px;
  width: 20px;
  text-align: center;
  background-color: #3b82f6;
  color: #fff;
  border-radius: 50%;
  cursor: grab;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledTrack = styled.div`
  top: 9px;
  bottom: 0;
  background: ${props => props.index === 1 ? '#3b82f6' : '#e2e8f0'};
  border-radius: 999px;
  height: 2px;
`;

const NumberInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const AdvancedSettings = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const AdvancedToggle = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    color: #374151;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchForm = ({ searchParams, onSearch, isLoading }) => {
  const [formData, setFormData] = useState(searchParams);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleYearRangeChange = (values) => {
    setFormData(prev => ({
      ...prev,
      fromYear: values[0],
      toYear: values[1]
    }));
  };

  return (
    <FormCard>
      <FormTitle>Søkeparametere</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Stikkord</Label>
          <Input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            placeholder="Angi noen stikkord for å forme et utvalg tekster"
          />
        </FormGroup>

        <FormGroup>
          <SliderLabel>
            <Label>Tidsperiode</Label>
            <SliderValue>
              {formData.fromYear} - {formData.toYear}
            </SliderValue>
          </SliderLabel>
          <SliderContainer>
            <StyledSlider
              value={[formData.fromYear, formData.toYear]}
              onChange={handleYearRangeChange}
              min={1800}
              max={2022}
              renderTrack={(props, state) => <StyledTrack {...props} index={state.index} />}
              renderThumb={(props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>}
            />
          </SliderContainer>
        </FormGroup>

        <AdvancedToggle
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼' : '▶'} Avanserte innstillinger
        </AdvancedToggle>

        {showAdvanced && (
          <AdvancedSettings>
            <FormGroup>
              <Label>Vindustørrelse</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <NumberInput
                  type="number"
                  min="300"
                  value={formData.window}
                  onChange={(e) => setFormData(prev => ({ ...prev, window: parseInt(e.target.value) || 2500 }))}
                />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ord per vindu</span>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Stegstørrelse</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <NumberInput
                  type="number"
                  min="100"
                  value={formData.stepSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, stepSize: parseInt(e.target.value) || 100 }))}
                />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>ord mellom hvert vindu</span>
              </div>
            </FormGroup>
          </AdvancedSettings>
        )}

        <SearchButton type="submit" disabled={isLoading}>
          {isLoading ? 'Søker...' : 'Søk i korpus'}
        </SearchButton>
      </form>
    </FormCard>
  );
};

export default SearchForm;
