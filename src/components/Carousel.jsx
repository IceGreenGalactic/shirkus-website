import React from "react";
import {
  CarouselContainer,
  CarouselImage,
  CarouselNav,
  PositionIndicator,
  CarouselCaptionContainer,
} from "./Carousel.styled";

const Carousel = ({ images, currentIndex, setCurrentImageIndex }) => {
  const { imageUrl, caption } = images[currentIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <CarouselContainer className="col-lg-10 col-xl-8 col-xxl-6 mx-auto">
      <CarouselNav onClick={prevImage}>❮</CarouselNav>

      <CarouselImage src={imageUrl} alt={caption} />

      {caption && (
        <CarouselCaptionContainer>
          <p>{caption}</p>
        </CarouselCaptionContainer>
      )}

      <PositionIndicator>
        <span>
          {currentIndex + 1}/{images.length}
        </span>
      </PositionIndicator>

      <CarouselNav onClick={nextImage}>❯</CarouselNav>
    </CarouselContainer>
  );
};

export default Carousel;
