import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  ModalOverlay,
  NavigationButton,
  Counter,
  ModalContent,
  CloseButton,
} from "./Modals.styled";
import { urlFor, videoUrlFor } from "./sanityImage";

const GalleryImageModal = ({
  mediaItems,
  currentMediaIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const currentMedia = mediaItems[currentMediaIndex];
  const videoUrl = videoUrlFor(currentMedia.url); // Fetch URL properly

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        {currentMedia.type === "image" ? (
          <img
            src={urlFor(currentMedia.asset)}
            alt={`Gallery image ${currentMediaIndex + 1}`}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              minWidth: "60vw",
              minHeight: "60vh",
              objectFit: "contain",
            }}
          />
        ) : (
          <div>
            <video
              controls
              playsInline
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                minWidth: "60vw",
                minHeight: "60vh",
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <NavigationButton direction="left" onClick={onPrev}>
          <FaAngleLeft />
        </NavigationButton>
        <NavigationButton direction="right" onClick={onNext}>
          <FaAngleRight />
        </NavigationButton>

        <Counter>
          {currentMediaIndex + 1} / {mediaItems.length}
        </Counter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GalleryImageModal;
