// Modal.js
import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const Modal = ({ imageUrl, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <img
          src={imageUrl}
          alt="Vis bilde"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            minWidth: "60vw",
            minHeight: "60vh",
            widt: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
