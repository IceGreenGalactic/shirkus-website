import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { DogCard, DogsContainer } from "./OurDogs.styled";

const OurDogs = () => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "dog"]{
          _id,
          name,
          nickname,
          "imageUrl": image.asset->url
        }`
      )
      .then((data) => {
        setDogs(data);
      })
      .catch(console.error);
  }, []);

  return (
    <DogsContainer className="container mt-4 col-lg-10">
      <h2 className="mb-3 text-center">Våre Hunder</h2>
      <div className="row g-4">
        {dogs.map((dog) => (
          <div
            key={dog._id}
            className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto"
          >
            <DogCard>
              <Link to={`/dogs/${dog._id}`}>
                <img src={dog.imageUrl} alt={dog.name} />
                <h3>{dog.nickname}</h3>
                <h4>{dog.name}</h4>
              </Link>
            </DogCard>
          </div>
        ))}
      </div>
    </DogsContainer>
  );
};

export default OurDogs;
