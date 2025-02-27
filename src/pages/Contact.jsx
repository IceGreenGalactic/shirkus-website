import React from "react";
import {
  ContactContainer,
  Title,
  Paragraph,
  ContactInfo,
  ContactInfoContainer,
} from "./Contact.styled";

const Contact = () => {
  return (
    <ContactContainer className="col-10 col-lg-8 m-auto">
      <Title>Kontakt</Title>
      <Paragraph className="mb-5">
        Ønsker du å lære mer om våre storpudler, eller vurderer du å kjøpe valp?
        <br />
        Ta gjerne kontakt for en hyggelig prat!
      </Paragraph>
      <ContactInfoContainer className="mb-5">
        <ContactInfo>Bente Tyrholm: </ContactInfo>
        <ContactInfo>📍 Adresse: Bødalen , Norge</ContactInfo>
        <ContactInfo>📞 Telefon: +47 90 78 95 96</ContactInfo>
        <ContactInfo>📧 E-post: shirkus@outlook.com</ContactInfo>
      </ContactInfoContainer>
    </ContactContainer>
  );
};

export default Contact;
