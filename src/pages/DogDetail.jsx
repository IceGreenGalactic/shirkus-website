import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import Modal from "../utils/modal";
import {
  DetailContainer,
  DogImage,
  DogName,
  DogInfo,
  HealthResults,
  HealthResultItem,
  InfoWrapper,
  PedigreeImage,
  GalleryContainer,
  GalleryImage,
} from "./DogDetail.styled";

const DogDetail = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "dog" && _id == $id]{
          _id,
          name,
          nickname,
          dogType,
          breed,
          color,
          gender,
          dateOfBirth,
          dateOfDeath,
          registrationNumber,
          healthResults,
          breedingNotes,
          "imageUrl": image.asset->url,
          "pedigreeUrl": pedigree.asset->url,
          "gallery": gallery[] {
            asset-> {
              _id,
              url
            }
          },
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
            <div className="col-10 col-sm-8 mx-auto">
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

                <div className="d-flex">
                  {dog.dogType === "deceased" ? (
                    <>
                      {dog.dateOfBirth && (
                        <DogInfo className="d-flex flex-column">
                          <strong>Fødselsdato:</strong>{" "}
                          {new Date(dog.dateOfBirth).toLocaleDateString(
                            "no-NO",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                          -{" "}
                          {new Date(dog.dateOfDeath).toLocaleDateString(
                            "no-NO",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </DogInfo>
                      )}
                    </>
                  ) : (
                    dog.dateOfBirth && (
                      <DogInfo>
                        <strong>Fødselsdato:</strong>{" "}
                        {new Date(dog.dateOfBirth).toLocaleDateString("no-NO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </DogInfo>
                    )
                  )}
                </div>
                {dog.dogType === "breeding" && (
                  <DogInfo>
                    <strong>Avlshund:</strong> Ja
                  </DogInfo>
                )}
                {dog.registrationNumber && (
                  <DogInfo>
                    <strong>Registreringsnummer:</strong>{" "}
                    {dog.registrationNumber}
                  </DogInfo>
                )}

                {dog.dogType === "breeding" && dog.breedingNotes && (
                  <div className="border p-3 p-md-0 py-md-3 px-md-1 mb-5 mb-md-0">
                    <DogInfo>{dog.breedingNotes}</DogInfo>
                  </div>
                )}
              </InfoWrapper>
            </div>

            {/* Del for helseresultater */}
            <div className="col-10 col-sm-4 mx-auto">
              {dog.healthResults?.length > 0 && (
                <InfoWrapper className="m-auto">
                  <HealthResults>
                    <p className="mb-0">Helseresultater:</p>
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

      {/* Gallery Section */}
      {dog.gallery && dog.gallery.length > 0 && (
        <GalleryContainer className="mt-4">
          <h4>Galleri:</h4>
          <div className="row">
            {dog.gallery.map((image, index) =>
              image.asset ? (
                <GalleryImage
                  key={index}
                  src={image.asset.url}
                  alt={`Galleri bilde ${index + 1}`}
                  onClick={() => {
                    setCurrentImage(image.asset.url);
                    setIsModalOpen(true);
                  }}
                />
              ) : null
            )}
          </div>
        </GalleryContainer>
      )}

      {/* Pedigree Section */}
      {dog.pedigreeUrl && (
        <div className="mt-5 text-center">
          <h4>Stamtavle:</h4>
          <PedigreeImage
            src={dog.pedigreeUrl}
            alt="Stamtavle"
            onClick={() => {
              setCurrentImage(dog.pedigreeUrl);
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {/* Modal for displaying images */}
      {isModalOpen && (
        <Modal imageUrl={currentImage} onClose={() => setIsModalOpen(false)} />
      )}
    </DetailContainer>
  );
};

export default DogDetail;
