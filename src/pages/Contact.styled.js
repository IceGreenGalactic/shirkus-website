import styled from "styled-components";

export const ContactContainer = styled.div`
  text-align: start;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.accent};
  font-weight: 900;
  margin-bottom: 1rem;
`;

export const Paragraph = styled.p`
  font-size: 1.2rem;
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;
export const ContactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0 auto;
  width: fit-content;
  max-width: 90vw;
  max-width: 700px;

  img {
    border-radius: 5px;
    border: 8px solid white;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

export const ContactInfo = styled.p`
  text-align: start;
  width: 100%;
  max-width: 600px;
  margin-bottom: 0.5rem;

  text-indent: -2.5rem;
  padding-left: 2.5rem;
  line-height: 1.6;
  white-space: pre-wrap;

  font-family: ${(props) => props.theme.fonts.body};
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.secondary};

  .label {
    color: ${(props) => props.theme.colors.text};
    margin-right: 0.25rem;
  }
`;

export const AddressInfo = styled(ContactInfo)`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 2.5rem;
  margin-bottom: 0.5rem;

  .label {
    font-weight: 500;
    grid-column: 1;
    white-space: nowrap;
  }

  .address-lines {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .address-line {
    white-space: nowrap;
  }
`;
