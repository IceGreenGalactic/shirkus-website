// src/pages/DogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import {
  DetailContainer,
  DogImage,
  DogName,
  DogInfo,
  HealthResults,
  HealthResultItem,
} from "./DogDetail.styled"; // Importer stilene

const DogDetail = () => {
  const { id } = useParams(); // Hent hundens ID fra URL-en
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "dog" && _id == $id]{
          _id,
          name,
          nickname,
          breed,
          color,
          gender,
          dateOfBirth,
          registrationNumber,
          healthResults,
          "imageUrl": image.asset->url,
          "pedigreeUrl": pedigree.asset->url,
          description
        }`,
        { id } // Send hundens ID som parameter
      )
      .then((data) => {
        setDog(data[0]); // Hent den første hunden fra data
        setLoading(false); // Sett loading til false når data er hentet
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Vis en lastemelding mens data hentes
  }

  if (!dog) {
    return <div>No dog found.</div>; // Håndter tilfelle der hund ikke finnes
  }

  return (
    <DetailContainer>
      <DogName>{dog.nickname}</DogName>
      <DogImage src={dog.imageUrl} alt={dog.name} />
      <h3>{dog.name}</h3>
      <DogInfo>Breed: {dog.breed}</DogInfo>
      <DogInfo>Color: {dog.color}</DogInfo>
      <DogInfo>Gender: {dog.gender}</DogInfo>
      <DogInfo>Date of Birth: {dog.dateOfBirth}</DogInfo>
      <DogInfo>Registration Number: {dog.registrationNumber}</DogInfo>
      <DogInfo>Description: {dog.description}</DogInfo>

      {dog.healthResults && dog.healthResults.length > 0 && (
        <HealthResults>
          <h4>Health Results:</h4>
          <ul>
            {dog.healthResults.map((result, index) => (
              <HealthResultItem key={index}>
                <strong>{result.title}: </strong>
                {result.description}
              </HealthResultItem>
            ))}
          </ul>
        </HealthResults>
      )}

      {/* Legg til bilde av stamtavle hvis tilgjengelig */}
      {dog.pedigreeUrl && (
        <>
          <h4>Pedigree:</h4>
          <DogImage src={dog.pedigreeUrl} alt="Pedigree" />
        </>
      )}
    </DetailContainer>
  );
};

export default DogDetail;
