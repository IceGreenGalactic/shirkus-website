import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  ContactContainer,
  Title,
  Paragraph,
  ContactInfo,
  ContactInfoContainer,
  AddressInfo,
} from "./Contact.styled";

const Contact = () => {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{contactText,name, address, phoneNumber, email, extraInfo, contactImage}`
      )
      .then((data) => {
        setSiteInfo(data);
      })
      .catch(console.error);
  }, []);

  if (!siteInfo) {
    return <LoadingSpinner />;
  }

  return (
    <ContactContainer className="col-10 col-lg-8 mx-auto text-center m-auto">
      <Title>Kontakt</Title>
      {siteInfo.contactText && (
        <Paragraph className="mb-5 ">{siteInfo.contactText}</Paragraph>
      )}

      <ContactInfoContainer className=" text-start display-flex justify-content-center  col-10 m-auto">
        {siteInfo.name && (
          <ContactInfo className=" text-start  ">
            <span className="label">👤 Navn:</span> {siteInfo.name}
          </ContactInfo>
        )}

{siteInfo.address && (
  <AddressInfo>
    <span className="label">📍 Adresse:</span>
    <div className="address-lines">
      {siteInfo.address.split(',').map((part, index, arr) => (
        <div className="address-line" key={index}>
          {part.trim()}
          {index < arr.length - 1 ? ',' : ''}
        </div>
      ))}
    </div>
  </AddressInfo>
)}

        {siteInfo.phoneNumber && (
          <ContactInfo className=" text-start  ">
            <span className="label">📞 Telefon:</span> {siteInfo.phoneNumber}
          </ContactInfo>
        )}

        {siteInfo.email && (
          <ContactInfo className=" text-start  ">
            <span className="label">📧 E-post:</span> {siteInfo.email}
          </ContactInfo>
        )}

        {siteInfo.contactImage && (
          <img
            className="my-4 col-12 col-md-10 col-lg-8 m-auto"
            src={urlFor(siteInfo.contactImage)}
            alt="Kontaktbilde"
          />
        )}

        {siteInfo.extraInfo && (
          <ContactInfo className="col-12 col-sm-10 col-md-8 m-auto mt-2 text-start ">
            {siteInfo.extraInfo}
          </ContactInfo>
        )}
      </ContactInfoContainer>
    </ContactContainer>
  );
};

export default Contact;
