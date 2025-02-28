import React from "react";
import { AboutContainer, Title, Paragraph } from "./About.styled";

const About = () => {
  return (
    <AboutContainer className="col-10 col-lg-8 m-auto">
      <Title>Om Kennel Shirkus</Title>
      <Paragraph>
        Velkommen til vårt lille paradis for storpudler! 
        Jeg, Bente Tyrholm, har drevet med oppdrett av disse fantastiske hundene i flere tiår.
      </Paragraph>
      <Paragraph>
        Våre pudler er kjent for sitt gode lynne, sunne linjer og vakre farger – spesielt 
        grå, hvit og sort. Med lidenskap for rasen og fokus på kvalitet, avler vi 
        frem trygge, sosiale og kjærlige familiehunder.
      </Paragraph>
    </AboutContainer>
  );
};

export default About;
