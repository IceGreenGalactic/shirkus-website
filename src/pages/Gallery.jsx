import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  GalleryContainer,
  GalleryGrid,
  GalleryItem,
  Image,
  Title,
} from "./Gallery.styled";
import LoadingSpinner from "../utils/LoadingSpinner";
import sanityClient from "../sanityClient";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gallery"]{
  _id,
  title,
  "mainImageUrl": mainImage.asset->url,
  "imageCount": count(images)
}`
      )
      .then((data) => {
        setGalleries(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <GalleryContainer className="container col-lg-10 mx-auto">
      <h1>Gallerier</h1>
      <div className="row g-4">
        {galleries.length > 0 ? (
          galleries.map((gallery) => (
            <div
              key={gallery._id}
              className="col-12 col-sm-8 col-md-6 col-xl-4 mx-auto"
            >
              <NavLink to={`/gallery/${gallery._id}`}>
                <GalleryItem>
                  <Image src={gallery.mainImageUrl} alt={gallery.title} />
                  <div className="p-2">
                    <Title>{gallery.title}</Title>
                    <h4>
                      {gallery.imageCount !== undefined &&
                        ` (${gallery.imageCount} bilde${
                          gallery.imageCount === 1 ? "" : "r"
                        })`}
                    </h4>
                  </div>
                </GalleryItem>
              </NavLink>
            </div>
          ))
        ) : (
          <p>Ingen gallerier tilgjengelig.</p>
        )}
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
