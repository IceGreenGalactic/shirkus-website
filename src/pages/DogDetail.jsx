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
} from "./DogDetail.styled";

const DogDetail = () => {
  const { id } = useParams();
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
        { id }
      )
      .then((data) => {
        setDog(data[0]);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dog) {
    return <div>No dog found.</div>;
  }

  return (
    <DetailContainer>
      <DogName>{dog.nickname}</DogName>
      <DogImage src={dog.imageUrl} alt={dog.name} />
      <h3 className="mb-5 text-center">{dog.name}</h3>
      <div className="row m-auto">
        <div className="col-12 col-md-4 mx-auto h-100">
          {dog.breed && (
            <DogInfo>
              <strong>Breed: </strong>
              {dog.breed}
            </DogInfo>
          )}
          {dog.color && (
            <DogInfo>
              <strong>Color: </strong> {dog.color}
            </DogInfo>
          )}
          {dog.gender && (
            <DogInfo>
              <strong>Gender: </strong>
              {dog.gender}
            </DogInfo>
          )}
          {dog.dateOfBirth && (
            <DogInfo>
              <strong>Date of Birth: </strong> {dog.dateOfBirth}
            </DogInfo>
          )}
          {dog.registrationNumber && (
            <DogInfo>
              <strong>Registration Number: </strong>
              {dog.registrationNumber}
            </DogInfo>
          )}
          {dog.description && (
            <DogInfo>
              <strong>Description: </strong>
              {dog.description}
            </DogInfo>
          )}
        </div>
        <div className="col-12 col-md-4 mx-auto h-100">
          {dog.healthResults && dog.healthResults.length > 0 && (
            <HealthResults className="mt-4 mt-md-0">
              <h4>Helse resultater:</h4>
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
        </div>
      </div>
      <div className="mt-5">
        {dog.pedigreeUrl && (
          <>
            <h4>Pedigree:</h4>
            <DogImage src={dog.pedigreeUrl} alt="Pedigree" />
          </>
        )}
      </div>
    </DetailContainer>
  );
};

export default DogDetail;
