import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Bruker Link til å navigere til detaljside senere
import sanityClient from "../sanityClient";
import { DogsGrid, DogCard } from "./OurDogs.styled";

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
        // Fjerne duplisering
        setDogs(data); // Sett inn data direkte uten duplisering
      })
      .catch(console.error);
  }, []);

  return (
    <DogsGrid>
      {dogs.map((dog) => (
        <DogCard key={dog._id}>
          <Link to={`/dogs/${dog._id}`}>
            <img src={dog.imageUrl} alt={dog.name} />
            <h3>{dog.nickname}</h3>
            <h4>{dog.name}</h4>
          </Link>
        </DogCard>
      ))}
    </DogsGrid>
  );
};

export default OurDogs;
