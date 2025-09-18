import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ErrorIcon = styled.div`
  color: #dc2626;
  font-size: 1.25rem;
`;

const ErrorText = styled.div`
  color: #991b1b;
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #fecaca;
  }
`;

const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorText>{message}</ErrorText>
      </ErrorContent>
      {onDismiss && (
        <CloseButton onClick={onDismiss} aria-label="Lukk feilmelding">
          ×
        </CloseButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;
