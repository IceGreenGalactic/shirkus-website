import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { PuppyImage, PuppyGallery } from "../pages/LittersDetail.styled";
import { urlFor } from "../utils/sanityImage";
import GalleryImageModal from "../utils/GalleryImageModal";

const PuppyGalleryImages = ({ litterId }) => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter" && _id == $litterId]{
          galleryImages1[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages2[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages3[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages4[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages5[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages6[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages7[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages8[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages9[] { asset-> { _id, _ref }, crop, hotspot },
          galleryImages10[] { asset-> { _id, _ref }, crop, hotspot },
          textGallery1,
          textGallery2,
          textGallery3,
          textGallery4,
          textGallery5,
          textGallery6,
          textGallery7,
          textGallery8,
          textGallery9,
          galleryTitle1,
          galleryTitle2,
          galleryTitle3,
          galleryTitle4,
          galleryTitle5,
          galleryTitle6,
          galleryTitle7,
          galleryTitle8,
          galleryTitle9,
          galleryTitle10
        }`,
        { litterId }
      )
      .then((data) => {
        const litter = data[0];
        const galleryData = [];

        for (let i = 1; i <= 10; i++) {
          const imagesKey = `galleryImages${i}`;
          const textKey = `textGallery${i}`;
          const titleKey = `galleryTitle${i}`;

          if (litter[imagesKey]?.length > 0 || litter[textKey]) {
            galleryData.push({
              images: litter[imagesKey],
              text: litter[textKey],
              title: litter[titleKey] || `Galleri ${i}`,
            });
          }
        }

        setGalleryData(galleryData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gallery data:", error);
        setLoading(false);
      });
  }, [litterId]);

  if (loading) return <div>Loading galleries...</div>;

  const openGalleryModal = (galleryIndex, imageIndex) => {
    setCurrentGalleryIndex(galleryIndex);
    setCurrentImageIndex(imageIndex);
    setIsGalleryModalOpen(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? galleryData[currentGalleryIndex].images.length - 1
        : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryData[currentGalleryIndex].images.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  return (
    <div>
      {galleryData.length === 0
        ? ""
        : galleryData.map((gallery, galleryIndex) => (
            <div key={galleryIndex} className="mb-4 costum-border text-center">
              <h4 className="">{gallery.title}</h4>
              <div className="container mt-5 ">
                <PuppyGallery className="align-items-center col-10 m-auto">
                  {gallery.images.map((image, imageIndex) => (
                    <PuppyImage
                      key={imageIndex}
                      src={image.asset ? urlFor(image.asset) : ""}
                      alt={`Gallery Image ${imageIndex + 1}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => openGalleryModal(galleryIndex, imageIndex)}
                    />
                  ))}
                </PuppyGallery>
              </div>
              {gallery.text && <p>{gallery.text}</p>}
            </div>
          ))}

      {isGalleryModalOpen && galleryData[currentGalleryIndex] && (
        <GalleryImageModal
          images={galleryData[currentGalleryIndex].images.map((image) =>
            urlFor(image.asset)
          )}
          currentImageIndex={currentImageIndex}
          onClose={() => setIsGalleryModalOpen(false)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default PuppyGalleryImages;
