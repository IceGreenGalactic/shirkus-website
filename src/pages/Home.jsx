import React from "react";
import { HomeContainer, Description, Title } from "./Home.styled";
import HeroImage from "../assets/images/poodleHero.jpg";

const Home = () => {
  return (
    <HomeContainer>
      <Title>Velkommen til Kennel Shirkus</Title>

      <img
        src={HeroImage}
        alt="Hero Image of five poodles sitting in the grass"
        className="hero-image col-10 col-md-8"
      />
      <Description className="col-10 col-md-8 col-lg-6 m-auto my-3">
        Kennel Shirkus er et lite oppdrett av sort, hvit og går stor puddel.
        Her kan du lese om hundene, se bilder og finne ut om valpene våre. God
        fornøyelse!
      </Description>
    </HomeContainer>
  );
};

export default Home;
