import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { LittersContainer, LitterCard, UpcomingLitter } from "./Litters.styled";

const Litters = () => {
  const [litters, setLitters] = useState([]);
  const [upcomingLitter, setUpcomingLitter] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter"] | order(date desc){
          _id,
          parents,
          status,
          "imageUrl": image.asset->url
        }`
      )
      .then((data) => {
        const upcoming = data.find((litter) => litter.status === "upcoming");
        setUpcomingLitter(upcoming);
        setLitters(data.filter((litter) => litter.status !== "upcoming"));
      })
      .catch(console.error);
  }, []);

  return (
    <LittersContainer>
      {upcomingLitter && (
        <UpcomingLitter>
          <h2>Kommende Kull</h2>
          <Link to={`/litters/${upcomingLitter._id}`}>
            <img src={upcomingLitter.imageUrl} alt={upcomingLitter.parents} />
            <h3>{upcomingLitter.parents}</h3>
            <p>Valper ventes snart!</p>
          </Link>
        </UpcomingLitter>
      )}
      <h2>Tidligere Kull</h2>
      <div className="litters-grid">
        {litters.map((litter) => (
          <LitterCard key={litter._id}>
            <Link to={`/litters/${litter._id}`}>
              <img src={litter.imageUrl} alt={litter.parents} />
              <h4>{litter.parents}</h4>
            </Link>
          </LitterCard>
        ))}
      </div>
    </LittersContainer>
  );
};

export default Litters;
