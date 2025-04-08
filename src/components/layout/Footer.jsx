import React, { useState, useEffect } from "react";
import { FooterContainer } from "./Footer.styled";
import sanityClient from "../../sanityClient";

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
        <div className="row footer-content">
          <div className="col-12">
            <p>© {pageTitle} - ALL RIGHTS RESERVED</p>
          </div>

          {/* Right Column with site info and link */}
          <div className="">
            <div className="made-by d-flex flex-column ">
              <p className="">Nettside laget av Kristine Tyrholm</p>
              <p className="">
                <a href="https://kennel-editor.netlify.app/">
                  Ønsker du en nettside? Klikk her for informasjon
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;
