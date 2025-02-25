import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  DetailContainer,
  DogImage,
  DogName,
  DogInfo,
  HealthResults,
  HealthResultItem,
  InfoWrapper,
  PedigreeImage,
} from "./DogDetail.styled";

const DogDetail = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  if (loading) return <div>Laster...</div>;
  if (!dog) return <div>Fant ingen hund.</div>;

  return (
    <DetailContainer className="container">
      <div className="mb-5 mt-2 text-center">
        <DogName className="text-center">{dog.name}</DogName>
        <h4>"{dog.nickname}"</h4>
      </div>
      <div className="row align-items-start mb-4">
        <div className="col-12 col-md-6 d-flex justify-content-center">
          <DogImage className="w-100" src={dog.imageUrl} alt={dog.name} />
        </div>

        <div className="col-sm-10 col-md-6 mx-auto">
          <div className="row">
            <div className="col-10 col-sm-6 mx-auto">
              <InfoWrapper className="m-auto mt-4 mt-md-0">
                {dog.breed && (
                  <DogInfo>
                    <strong>Rase:</strong> {dog.breed}
                  </DogInfo>
                )}
                {dog.color && (
                  <DogInfo>
                    <strong>Farge:</strong> {dog.color}
                  </DogInfo>
                )}
                {dog.gender && (
                  <DogInfo>
                    <strong>Kjønn:</strong> {dog.gender}
                  </DogInfo>
                )}
                {dog.dateOfBirth && (
                  <DogInfo>
                    <strong>Fødselsdato:</strong> {dog.dateOfBirth}
                  </DogInfo>
                )}
                {dog.registrationNumber && (
                  <DogInfo>
                    <strong>Registreringsnummer:</strong>{" "}
                    {dog.registrationNumber}
                  </DogInfo>
                )}
              </InfoWrapper>
            </div>

            {/* Del for helseresultater */}
            <div className="col-10 col-sm-4 mx-auto">
              {dog.healthResults?.length > 0 && (
                <InfoWrapper className="m-auto">
                  <HealthResults>
                    <ul>
                      {dog.healthResults.map((result, index) => (
                        <HealthResultItem key={index}>
                          <strong>{result.title}:</strong> {result.description}
                        </HealthResultItem>
                      ))}
                    </ul>
                  </HealthResults>
                </InfoWrapper>
              )}
            </div>
          </div>
        </div>
      </div>

      {dog.description && (
        <DogInfo>
          <strong>Beskrivelse:</strong> {dog.description}
        </DogInfo>
      )}
      {dog.pedigreeUrl && (
        <div className="mt-5 text-center">
          <h4>Stamtavle:</h4>
          <PedigreeImage
            src={dog.pedigreeUrl}
            alt="Stamtavle"
            onClick={() => setIsLightboxOpen(true)}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {/* Lightbox for Pedigree */}
      <Lightbox
        slides={[{ src: dog.pedigreeUrl }]}
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        onClose={() => setIsLightboxOpen(false)}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        }}
      />
    </DetailContainer>
  );
};

export default DogDetail;
