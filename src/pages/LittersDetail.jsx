import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import LoadingSpinner from "../utils/LoadingSpinner";
import Modal from "../utils/ImageModal";
import {
  LitterContainer,
  ParentInfoContainer,
  PuppiesContainer,
  MainImgContainer,
  InfoRow,
  TitleRow,
  NameRow,
  ImageRow,
  NickNameRow,
} from "./LittersDetail.styled";
import GalleryModal from "../components/GalleryModal";

const LittersDetail = () => {
  const { id } = useParams();
  const [litter, setLitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("Error: Litter ID is undefined");
      return;
    }

    sanityClient
      .fetch(
        `*[_type == "litter" && _id == $id]{
          _id,
        mother {
  isOwned,
  "dogRef": dogReference->_id,
  name,
  nickname,
  title,
  registrationNumber,
  "image": image { asset-> { _id, _ref }, crop, hotspot },
   "overrideImage": overrideImage { asset-> { _id, _ref }, crop, hotspot },
  info,
  healthResults,
  additionalInfo
},
father {
  isOwned,
  "dogRef": dogReference->_id,
  name,
  nickname,
  title,
  registrationNumber,
  "image": image { asset-> { _id, _ref }, crop, hotspot },
   "overrideImage": overrideImage { asset-> { _id, _ref }, crop, hotspot },
  info,
  healthResults,
  additionalInfo
},

          puppyDetails,
          mainImage { asset-> { _id, _ref }, crop, hotspot },
          additionalImages[]{ asset-> { _id, _ref }, crop, hotspot },
          textUnderImages,
          dateOfBirth,
          galleries,
          expectedDateOfBirth,
          textUnderMainImage,
          freeText1,
          freeText2
        }`,
        { id }
      )
      .then((data) => {
        const litterData = data[0];
        const motherDogRef = litterData.mother.dogRef;
        const fatherDogRef = litterData.father.dogRef;

        return sanityClient
          .fetch(
            `*[_type == "dog" && _id in [$motherDogRef, $fatherDogRef]]{
      _id,
      name,
      nickname,
      title,
      registrationNumber,
      image { asset-> { _id, _ref }, crop, hotspot },
      info,
      healthResults,
      additionalInfo,
      overrideImage, 
    }`,
            { motherDogRef, fatherDogRef }
          )
          .then((dogData) => {
            const motherDog =
              dogData.find((dog) => dog._id === motherDogRef) || {};
            const fatherDog =
              dogData.find((dog) => dog._id === fatherDogRef) || {};
            litterData.mother = {
              ...litterData.mother,
              ...motherDog,
              overrideImage:
                litterData.mother.overrideImage || motherDog.overrideImage,
            };

            litterData.father = {
              ...litterData.father,
              ...fatherDog,
              overrideImage:
                litterData.father.overrideImage || fatherDog.overrideImage,
            };

            setLitter(litterData);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching dog data:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!litter) {
    return <div>Fant ingen kull.</div>;
  }

  const calculateTotalPuppies = () => {
    return (
      litter.puppyDetails?.reduce((total, puppy) => total + puppy.count, 0) || 0
    );
  };

  const totalPuppies = calculateTotalPuppies();

  const getColorPlural = (color, count) => {
    switch (color) {
      case "white":
        return count > 1 ? "hvite" : "hvit";
      case "gray":
        return count > 1 ? "grå" : "grå";
      case "black":
        return count > 1 ? "sorte" : "sort";
      case "brown":
        return count > 1 ? "brune" : "brun";
      case "apricot":
        return count > 1 ? "aprikos" : "aprikos";
      case "red":
        return count > 1 ? "røde" : "rød";
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
      ? "hann"
      : "tispe";
  };

  const openImageModal = (image) => setSelectedImage(image);

  const closeImageModal = () => setSelectedImage(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <LitterContainer className="col-10 m-auto col-md-8 col-lg-6">
      <h2 className="text-center">Kull Detaljer</h2>
      <ParentInfoContainer>
        <h3>Mor:</h3>

        <h3>Far:</h3>

        <TitleRow>{litter.mother.title || "\u00A0"}</TitleRow>
        <TitleRow>{litter.father.title || "\u00A0"}</TitleRow>

        <NameRow className="me-1">{litter.mother.name}</NameRow>
        <NameRow className="ms-1">{litter.father.name}</NameRow>

        <ImageRow className="me-1">
          <img
            src={urlFor(litter.mother.overrideImage || litter.mother.image)}
            alt={litter.mother.name}
            onClick={() =>
              openImageModal(
                urlFor(litter.mother.overrideImage || litter.mother.image)
              )
            }
          />
        </ImageRow>
        <ImageRow className="ms-1">
          <img
            src={urlFor(litter.father.overrideImage || litter.father.image)}
            alt={litter.father.name}
            onClick={() =>
              openImageModal(
                urlFor(litter.father.overrideImage || litter.father.image)
              )
            }
          />
        </ImageRow>
        <NickNameRow>
          {litter.mother.nickname && (
            <h4 className="nickname">{litter.mother.nickname}</h4>
          )}
        </NickNameRow>

        <NickNameRow>
          {litter.father.nickname && (
            <h4 className="nickname">{litter.father.nickname}</h4>
          )}
        </NickNameRow>

        <InfoRow className="mt-2 col-10 m-auto mb-2">
          {litter.mother.registrationNumber && (
            <p>
              <strong>Reg.nr:</strong> {litter.mother.registrationNumber}
            </p>
          )}
          <ul className="list-unstyled mt-2">
            {litter.mother.healthResults?.map((r, i) => (
              <li key={i}>
                <strong>{r.title}:</strong> {r.description}
              </li>
            ))}
          </ul>
          {litter.mother.additionalInfo && (
            <p>{litter.mother.additionalInfo}</p>
          )}
        </InfoRow>
        <InfoRow className="mt-2 col-10 m-auto mb-2">
          {litter.father.registrationNumber && (
            <p>
              <strong>Reg.nr:</strong> {litter.father.registrationNumber}
            </p>
          )}
          <ul className="list-unstyled mt-2">
            {litter.father.healthResults?.map((r, i) => (
              <li key={i}>
                <strong>{r.title}:</strong> {r.description}
              </li>
            ))}
          </ul>
          {litter.father.additionalInfo && (
            <p>{litter.father.additionalInfo}</p>
          )}
        </InfoRow>
      </ParentInfoContainer>

      <PuppiesContainer className="col-12 col-lg-10 m-auto">
        <div className="d-flex align-items-baseline col-10 m-auto justify-content-center">
          {litter.dateOfBirth ? (
            <div className="date-container text-center">
              <h3>Født:</h3>
              <h4>{formatDate(litter.dateOfBirth)}</h4>
            </div>
          ) : (
            litter.expectedDateOfBirth && (
              <h4>Valper ventes: {formatDate(litter.expectedDateOfBirth)}</h4>
            )
          )}
        </div>

        {litter.mainImage && (
          <>
            <MainImgContainer className="m-auto col-10 col-lg-8 col-xl-6 d-flex">
              <img
                className="mb-2 rounded"
                src={urlFor(litter.mainImage)}
                alt={`Valpene til ${litter.mother.nickname} og ${litter.father.nickname}`}
                onClick={() => openImageModal(urlFor(litter.mainImage))}
              />
            </MainImgContainer>
            <div className="mb-5 text-center">
              {litter.textUnderMainImage && <p>{litter.textUnderMainImage}</p>}
            </div>
          </>
        )}

        {litter.puppyDetails?.length > 0 && (
          <>
            <h4 className="text-center">Det ble født {totalPuppies} valper!</h4>
            <h5 className="text-center">
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
        )}

        {litter.freeText1 && (
          <div className="mb-3 col-10 m-auto">
            <h5 className="text-center">{litter.freeText1}</h5>
          </div>
        )}

        {litter.galleries?.length > 0 && <GalleryModal litterId={id} />}
      </PuppiesContainer>

      <div>
        {litter.freeText2 && (
          <div className="container text-center my-5">
            <p>{litter.freeText2}</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </LitterContainer>
  );
};

export default LittersDetail;
