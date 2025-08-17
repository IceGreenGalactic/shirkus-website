import React, { useState, useEffect } from "react";
import { FooterContainer } from "./Footer.styled";
import sanityClient from "../../sanityClient";
import { Link } from "react-router-dom";

const Footer = () => {
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{
          pageTitle
        }`
      )
      .then((data) => {
        if (data && data.pageTitle) {
          setPageTitle(data.pageTitle);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <FooterContainer>
      <div className="container">
        <div className="row ">
          <div>
            <div className="footer-content">
              <p>© {pageTitle} - ALL RIGHTS RESERVED</p>
              <div>
                <p className="made-by">Nettside laget av Kristine Tyrholm </p>
                <a href="https://kennel-editor.netlify.app/">
                  Ønsker du en nettside? Klikk her for informasjon
                </a>
              </div>

              <Link to="PrivacyPolicy">Personvernerklæring</Link>
            </div>
          </div>
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;
