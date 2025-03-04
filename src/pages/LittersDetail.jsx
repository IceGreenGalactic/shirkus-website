import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import Modal from "../utils/ImageModal";
import {
  LitterContainer,
  ParentInfoContainer,
  ParentInfo,
  ParentImage,
  PuppyGallery,
  PuppyImage,
  PuppiesContainer,
  MainImgContainer,
} from "./LittersDetail.styled";
import PuppyGalleryImages from "../components/PuppyGallerySection";

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
    return new Date(date).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <LitterContainer className="col-10 m-auto">
      <h2 className="text-center">Kull Detaljer</h2>
      <ParentInfoContainer className="m-auto mt-4">
        <ParentInfo>
          <h3 className="d-flex flex-column ">
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
          {litter.dateOfBirth ? (
            <div className="date-container">
              <h3>Dato Født:</h3>
              <h4>{formatDate(litter.dateOfBirth)}</h4>
            </div>
          ) : (
            litter.expectedDateOfBirth && (
              <h4>
                Valper:{" "}
                {new Date(litter.expectedDateOfBirth).toLocaleDateString(
                  "no-NO",
                  {
                    year: "numeric",
                    month: "long",
                  }
                )}
              </h4>
            )
          )}
        </div>

        {litter.mainImage && (
          <>
            <MainImgContainer className="m-auto col-12 d-flex">
              <img
                className="mb-2"
                src={urlFor(litter.mainImage)}
                alt={`Valpene til${litter.mother.nickname} og ${litter.father.nickname}`}
                onClick={() => openImageModal(urlFor(litter.mainImage))}
              />
            </MainImgContainer>
            <div className="mb-5 text-center">
              {litter.textUnderMainImage && <p>{litter.textUnderMainImage}</p>}
            </div>
          </>
        )}
        <div className="mb-3 mt-3">
          {litter.puppyDetails && litter.puppyDetails.length > 0 ? (
            <>
              <h4>
                {formatDate(litter.dateOfBirth)} ble det født; {totalPuppies}{" "}
                valper:
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
            </>
          ) : null}
        </div>

        {litter.freeText1 && (
          <div className="mb-3 ">
            <h5 className="text-center">{litter.freeText1}</h5>
          </div>
        )}

        {litter.galleryImages && litter.galleryImages.length > 0 && (
          <div className="container mt-5">
            <PuppyGalleryImages litterId={id} />
          </div>
        )}

        <div className="container">
          {litter.freeText2 && <p>{litter.freeText2}</p>}
        </div>
      </PuppiesContainer>

      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </LitterContainer>
  );
};

export default LittersDetail;
