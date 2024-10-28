// src/components/InstitutionSwitch.jsx
import React from 'react';
import styled from 'styled-components';

const InstitutionSwitch = ({ checked, onChange }) => {
  return (
    <SwitchContainer checked={checked} onClick={onChange}>
      <Toggle checked={checked}>
        {checked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon open"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 11V7a4 4 0 10-8 0v4m6 0h4a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h6z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon closed"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 11V7a4 4 0 00-8 0v4m6 0h4a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h6z"
            />
          </svg>
        )}
      </Toggle>
    </SwitchContainer>
  );
};

// Estilos con styled-components
const SwitchContainer = styled.div`
  width: 50px;
  height: 28px;
  background: ${({ checked }) =>
    checked ? 'linear-gradient(135deg, #20cca5, #17a398)' : 'linear-gradient(135deg, #ff5b5b, #d9534f)'};
  border-radius: 14px;
  padding: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ checked }) =>
    checked ? '0px 0px 10px rgba(32, 204, 165, 0.5)' : '0px 0px 10px rgba(255, 91, 91, 0.5)'};
`;

const Toggle = styled.div`
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.3s ease;
  transform: ${({ checked }) => (checked ? 'translateX(22px)' : 'translateX(0)')};
  
  .icon {
    width: 14px;
    height: 14px;
    stroke: ${({ checked }) => (checked ? '#20cca5' : '#ff5b5b')};
    stroke-width: 2;
    transition: stroke 0.3s ease, transform 0.3s ease;
  }

  .open {
    transform: ${({ checked }) => (checked ? 'scale(1)' : 'scale(0)')};
    opacity: ${({ checked }) => (checked ? 1 : 0)};
  }

  .closed {
    transform: ${({ checked }) => (checked ? 'scale(0)' : 'scale(1)')};
    opacity: ${({ checked }) => (checked ? 0 : 1)};
  }
`;

export default InstitutionSwitch;
