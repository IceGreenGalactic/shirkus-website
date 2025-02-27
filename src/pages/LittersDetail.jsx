import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
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
    sanityClient.fetch(
        `*[_type == "litter" && _id == $id]{
            mother {
                name,
                nickname,
                "image": image { asset-> { _id, _ref }, crop, hotspot }, 
                info
            },
            father {
                name,
                nickname,
                "image": image { asset-> { _id, _ref }, crop, hotspot }, 
                info
            },
            puppyDetails,
            mainImage { asset-> { _id, url }, crop, hotspot }, 
            additionalImages[]{ asset-> { _id, url }, crop, hotspot }, 
            textUnderImages,
            dateOfBirth,
            expectedDateOfBirth
        }`,
        { id }
      )
      .then((data) => {
        setLitter(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
      
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
        <div className="col-md-6">
          <ParentInfo>
            <h3>
              Mor: {litter.mother.nickname} ({litter.mother.name})
            </h3>
            {litter.mother.image && (
              <ParentImage
                src={urlFor(litter.mother.image)}
                alt={litter.mother.name}
              />
            )}
            {litter.mother.info && <p>{litter.mother.info}</p>}
          </ParentInfo>
        </div>
        <div className="col-md-6">
          <ParentInfo>
            <h3>
              Far: {litter.father.nickname} ({litter.father.name})
            </h3>
            {litter.father.image && (
              <ParentImage
                src={urlFor(litter.father.image)}
                alt={litter.father.name}
              />
            )}
            {litter.father.info && <p>{litter.father.info}</p>}
          </ParentInfo>
        </div>
      </div>
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
        <img
          src={urlFor(litter.mainImage)}
          alt="Kull bilde"
        />
      )}
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
      {litter.additionalImages && litter.additionalImages.length > 0 && (
        <PuppyGallery>
          <h4>Bildegalleri:</h4>
          {litter.additionalImages.map((image, index) => (
            <PuppyImage
              key={index}
              src={urlFor(image)}
              alt={`Valp bilde ${index + 1}`}
            />
          ))}
        </PuppyGallery>
      )}
      {litter.textUnderImages && <p>{litter.textUnderImages}</p>}
    </LitterContainer>
  );
};

export default LittersDetail;
