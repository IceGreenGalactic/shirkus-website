import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { urlFor, videoUrlFor } from "../utils/sanityImage";
import GalleryImageModal from "../utils/GalleryImageModal";
import {
  GalleryContainer,
  GalleryImage,
  VideoContainer,
} from "../styles/galleryImages.styled";

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
        galleries[] {
          title,
          images[] { asset-> { _id, _ref }, crop, hotspot },
video { asset-> { _id, url } },
          description
        }
      }`,
        { litterId }
      )
      .then((data) => {
        const litter = data[0];
        if (litter.galleries) {
          const galleryData = litter.galleries.map((gallery, index) => ({
            images: gallery.images || [],
            video: gallery.video?.asset?.url || null, // Fix for single video object
            text: gallery.description,
            title: gallery.title || `Galleri ${index + 1}`,
          }));
          setGalleryData(galleryData);
        } else {
          setGalleryData([]);
        }
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

  // The renderMedia function is now utilized
  const renderMedia = (asset) => {
    if (!asset) return <div>Media unavailable</div>;

    // Handle image
    if (asset._type === "image") {
      const imageUrl = urlFor(asset);
      return <img src={imageUrl} alt="Gallery Image" />;
    }

    // Handle video
    if (asset._type === "file" && asset._ref) {
      const videoUrl = videoUrlFor(asset);
      return (
        <div>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return null; // Return null if not an image or video
  };

  return (
    <div>
      {galleryData.length > 0 ? (
        galleryData.map((gallery, galleryIndex) => (
          <GalleryContainer key={galleryIndex} className="mb-4">
            <h4>{gallery.title}</h4>

            {/* Display video above images if available */}
            {gallery.video && (
              <VideoContainer className="col-5">
                <video controls>
                  <source src={gallery.video} type="video/mp4" loading="lazy" />
                  Your browser does not support the video tag.
                </video>
              </VideoContainer>
            )}

            <div className="row">
              {gallery.images.map((image, imageIndex) => (
                <div className="col-6 col-md-4 col-lg-3 mb-3" key={imageIndex}>
                  <GalleryImage
                    src={urlFor(image.asset)}
                    alt={`Gallery Image ${imageIndex + 1}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => openGalleryModal(galleryIndex, imageIndex)}
                  />
                </div>
              ))}
            </div>

            {gallery.text && <p className="mt-2">{gallery.text}</p>}
          </GalleryContainer>
        ))
      ) : (
        <div>No gallery available for this litter.</div>
      )}

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
