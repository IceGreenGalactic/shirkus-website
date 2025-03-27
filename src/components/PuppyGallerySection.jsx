import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import GalleryImageModal from "../utils/GalleryImageModal";
import {
  GalleryContainer,
  GalleryImage,
  VideoThumbnail,
} from "../styles/galleryImages.styled";
import { FaPlayCircle } from "react-icons/fa";

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
            video: gallery.video?.asset?.url || null,
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

  const openGalleryModal = (galleryIndex, mediaIndex) => {
    setCurrentGalleryIndex(galleryIndex);
    setCurrentImageIndex(mediaIndex);
    setIsGalleryModalOpen(true);
  };

  const prevImage = () => {
    const mediaItems = getMediaItems(galleryData[currentGalleryIndex]);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    const mediaItems = getMediaItems(galleryData[currentGalleryIndex]);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getMediaItems = (gallery) => {
    const mediaItems = gallery.images.map((image) => ({
      type: "image",
      asset: image.asset,
    }));

    if (gallery.video) {
      mediaItems.push({
        type: "video",
        url: gallery.video,
      });
    }

    return mediaItems;
  };

  return (
    <div>
      {galleryData.length > 0 ? (
        galleryData.map((gallery, galleryIndex) => (
          <GalleryContainer key={galleryIndex} className="mb-4">
            <h4>{gallery.title}</h4>

            <div className="row">
              {getMediaItems(gallery).map((mediaItem, mediaIndex) => (
                <div className="col-6 col-md-4 col-lg-3 mb-3" key={mediaIndex}>
                  {mediaItem.type === "image" ? (
                    <GalleryImage
                      src={urlFor(mediaItem.asset)}
                      alt={`Gallery Image ${mediaIndex + 1}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => openGalleryModal(galleryIndex, mediaIndex)}
                    />
                  ) : (
                    <div className="row">
                      <VideoThumbnail
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() =>
                          openGalleryModal(galleryIndex, mediaIndex)
                        }
                      >
                        <video
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={mediaItem.url}
                          muted
                        />
                        <FaPlayCircle
                          size={50}
                          color="white"
                          style={{
                            position: "absolute",
                            zIndex: 2,
                            pointerEvents: "none",
                          }}
                        />
                      </VideoThumbnail>
                    </div>
                  )}
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
          mediaItems={getMediaItems(galleryData[currentGalleryIndex])}
          currentMediaIndex={currentImageIndex}
          onClose={() => setIsGalleryModalOpen(false)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default PuppyGalleryImages;
