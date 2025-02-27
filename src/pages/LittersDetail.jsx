import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import Modal from "../utils/modal.jsx";
import {
  LitterContainer,
  ParentInfoContainer,
  ParentInfo,
  ParentImage,
  PuppyGallery,
  PuppyImage,
  PuppiesContainer,
} from "./LittersDetail.styled";

const LittersDetail = () => {
  const { id } = useParams();
  const [litter, setLitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
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
            mainImage { asset-> { _id, _ref }, crop, hotspot }, 
            additionalImages[]{ asset-> { _id, _ref }, crop, hotspot }, 
            galleryImages[] { asset-> { _id, _ref }, crop, hotspot }, 
            textUnderImages,
            dateOfBirth,
            expectedDateOfBirth,
            textUnderMainImage,
            textUnderGallery,
            freeText1,
            freeText2
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

  // Function to render info as bullet points
  const renderInfoAsBulletPoints = (info) => {
    return (
      <ul>
        {info.split("\n").map((item, index) => (
          <li className="list-unstyled text-start" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  // Funksjon for å beregne totalt antall valper
  const calculateTotalPuppies = () => {
    if (!litter.puppyDetails || litter.puppyDetails.length === 0) {
      return 0;
    }

    return litter.puppyDetails.reduce((total, puppy) => total + puppy.count, 0);
  };

  const totalPuppies = calculateTotalPuppies();

  const getColorPlural = (color, count) => {
    switch (color) {
      case "white":
        return count > 1 ? "hvite" : "hvit";
      case "gray":
        return count > 1 ? "grå" : "grå";
      case "black":
        return count > 1 ? "sorte" : "svart";
      default:
        return color;
    }
  };

  const getGenderPlural = (gender, count) => {
    return count > 1
      ? gender === "male"
        ? "hanner"
        : "tisper"
      : gender === "male"
      ? "Hann"
      : "Tispe";
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <LitterContainer className="col-10 m-auto">
      <h2 className="text-center">Kull Detaljer</h2>
      <ParentInfoContainer className="m-auto mt-4">
        <ParentInfo>
          <h3 className="d-flex flex-column">
            <strong> Mor: </strong>
            {litter.mother.name}
          </h3>
          <div className="col-12 col-md-8 m-auto">
            {litter.mother.image && (
              <ParentImage
                src={urlFor(litter.mother.image)}
                alt={litter.mother.name}
              />
            )}
            {litter.mother.nickname && <h4>{litter.mother.nickname}</h4>}
            {litter.mother.info && renderInfoAsBulletPoints(litter.mother.info)}
          </div>
        </ParentInfo>
        <ParentInfo>
          <h3 className="d-flex flex-column">
            <strong> Far:</strong> {litter.father.name}
          </h3>
          <div className="col-12 col-md-8 m-auto">
            {litter.father.image && (
              <ParentImage
                src={urlFor(litter.father.image)}
                alt={litter.father.name}
              />
            )}
            {litter.father.nickname && <h4>{litter.father.nickname}</h4>}
            {litter.father.info && renderInfoAsBulletPoints(litter.father.info)}
          </div>
        </ParentInfo>
      </ParentInfoContainer>
      <PuppiesContainer className="col-10 m-auto">
        <div className="d-flex align-items-baseline col-10 m-auto justify-content-center">
          <h3>Dato Født: </h3>
          {litter.dateOfBirth && (
            <h4>{formatDate(litter.dateOfBirth)}</h4>
          )}
        </div>
        {!litter.dateOfBirth && litter.expectedDateOfBirth && (
          <h4>
            Forventet fødselsdato: {formatDate(litter.expectedDateOfBirth)}
          </h4>
        )}

        {litter.mainImage && (
          <>
            <div className="col-8 m-auto">
              <img
                className="mb-2 col-8 h-75"
                src={urlFor(litter.mainImage)}
                alt="Kull bilde"
              />
            </div>
            <div className="mb-5">
              {litter.textUnderMainImage && <p>{litter.textUnderMainImage}</p>}
            </div>
          </>
        )}
        <div className="mb-3 mt-3">
          {litter.puppyDetails && litter.puppyDetails.length > 0 ? (
            <>
              <h4>
                {formatDate(litter.dateOfBirth)} ble det født; {totalPuppies} valper:
              </h4>
              <h5>
                {litter.puppyDetails
                  .reduce((acc, puppy) => {
                    const gender = puppy.gender;
                    const color = puppy.color;

                    const existing = acc.find(
                      (item) => item.color === color && item.gender === gender
                    );
                    if (existing) {
                      existing.count += puppy.count;
                    } else {
                      acc.push({ color, gender, count: puppy.count });
                    }
                    return acc;
                  }, [])
                  .map(
                    (item) =>
                      `${item.count} ${getColorPlural(
                        item.color,
                        item.count
                      )} ${getGenderPlural(item.gender, item.count)}`
                  )
                  .join(", ")}
              </h5>
              <h5> {litter.freeText1 && <p>{litter.freeText1}</p>}</h5>
            </>
          ) : null}
        </div>
        {/* Vis galleribilder hvis de finnes */}
        <div className="container mt-5">
          <h3>Bildegalleri:</h3>
          {litter.galleryImages && litter.galleryImages.length > 0 && (
            <PuppyGallery>
              {litter.galleryImages.map((image, index) => (
                <PuppyImage
                  key={index}
                  src={urlFor(image)}
                  alt={`Valp bilde ${index + 1}`}
                  onClick={() => openImageModal(urlFor(image))}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </PuppyGallery>
          )}
          {litter.textUnderGallery && <p>{litter.textUnderGallery}</p>}
        </div>
        <div className="container">
          {/* Vis fritekst om det finnes */}
          {litter.freeText2 && <p>{litter.freeText2}</p>}
        </div>
      </PuppiesContainer>

      {/* Modal for å vise det valgte bildet */}
      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </LitterContainer>
  );
};

export default LittersDetail;
