import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import {
  LitterContainer,
  ParentInfo,
  ParentImage,
  PuppyGallery,
  PuppyImage,
} from "./LittersDetail.styled";

const LittersDetail = () => {
  const { id } = useParams();
  const [litter, setLitter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter" && _id == $id]{
          mother {
            name,
            nickname,
            "imageUrl": image.asset->url,
            info
          },
          father {
            name,
            nickname,
            "imageUrl": image.asset->url,
            info
          },
          puppyCount,
          expectedPuppies,
          puppyDetails,
          mainImage,
          additionalImages,
          textUnderImages,
          dateOfBirth,
          expectedDateOfBirth // Hent forventet fødselsdato
        }`,
        { id }
      )
      .then((data) => {
        setLitter(data[0]);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  if (loading) {
    return <div>Laster...</div>;
  }

  if (!litter) {
    return <div>Fant ingen kull.</div>;
  }

  return (
    <LitterContainer className="container">
      <h2>Kull Detaljer</h2>

      <div className="row">
        {/* Mor Info */}
        <div className="col-md-6">
          <ParentInfo>
            <h3>
              Mor: {litter.mother.nickname} ({litter.mother.name})
            </h3>
            {litter.mother.imageUrl && (
              <ParentImage
                src={litter.mother.imageUrl}
                alt={litter.mother.name}
              />
            )}
            {litter.mother.info && <p>{litter.mother.info}</p>}
          </ParentInfo>
        </div>

        {/* Far Info */}
        <div className="col-md-6">
          <ParentInfo>
            <h3>
              Far: {litter.father.nickname} ({litter.father.name})
            </h3>
            {litter.father.imageUrl && (
              <ParentImage
                src={litter.father.imageUrl}
                alt={litter.father.name}
              />
            )}
            {litter.father.info && <p>{litter.father.info}</p>}
          </ParentInfo>
        </div>
      </div>

      {/* Dato for fødsel og hovedbilde */}
      {litter.dateOfBirth && (
        <h4>Dato født: {new Date(litter.dateOfBirth).toLocaleDateString()}</h4>
      )}
      {!litter.dateOfBirth && litter.expectedDateOfBirth && (
        <h4>
          Forventet fødselsdato:{" "}
          {new Date(litter.expectedDateOfBirth).toLocaleDateString("no-NO", {
            year: "numeric",
            month: "long",
          })}
        </h4>
      )}
      {litter.mainImage && (
        <img src={litter.mainImage.asset.url} alt="Kull bilde" />
      )}

      {/* Detaljer om valper */}
      <h4>Detaljer om valper</h4>
      {litter.puppyDetails &&
        litter.puppyDetails.map((puppy, index) => (
          <div key={index}>
            <h5>Valp {index + 1}:</h5>
            <p>Kjønn: {puppy.gender === "male" ? "Hann" : "Tispe"}</p>
            <p>Farge: {puppy.color}</p>
            <p>Antall: {puppy.count}</p>
          </div>
        ))}

      {/* Ytterligere bilder */}
      {litter.additionalImages && litter.additionalImages.length > 0 && (
        <PuppyGallery>
          <h4>Bildegalleri:</h4>
          {litter.additionalImages.map((image, index) => (
            <PuppyImage
              key={index}
              src={image.asset.url}
              alt={`Valp bilde ${index + 1}`}
            />
          ))}
        </PuppyGallery>
      )}

      {/* Ytterligere tekst under bildene */}
      {litter.textUnderImages && <p>{litter.textUnderImages}</p>}
    </LitterContainer>
  );
};

export default LittersDetail;
