import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { LitterCard, LitterContainer } from "./Litters.styled";

const Litters = () => {
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter"]{
          _id,
          mother {
            name,
            nickname,
            "imageUrl": image.asset->url
          },
          father {
            name,
            nickname,
            "imageUrl": image.asset->url
          },
          expectedPuppies,
          puppyCount,
          dateOfBirth
        }`
      )
      .then((data) => {
        // Sort litters: upcoming first, then others
        const upcomingLitters = data.filter(litter => !litter.dateOfBirth);
        const pastLitters = data.filter(litter => litter.dateOfBirth);
        const sortedLitters = [...upcomingLitters, ...pastLitters];
        
        setLitters(sortedLitters);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  return (
    <LitterContainer className="container mt-4">
      <h2>Kull</h2>
      <div className="row g-4">
        {litters.map((litter) => (
          <div key={litter._id} className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto">  
            <LitterCard>
              <Link to={`/litters/${litter._id}`}>
                <h3>{litter.mother.nickname} & {litter.father.nickname}</h3>
                {litter.mother.imageUrl && (
                  <img src={litter.mother.imageUrl} alt={`${litter.mother.nickname} & ${litter.father.nickname}`} />
                )}
                {litter.expectedPuppies && (
                  <p>Forventede valper: {litter.expectedPuppies}</p>
                )}
                {litter.puppyCount && (
                  <p>Antall valper: {litter.puppyCount}</p>
                )}
                {litter.dateOfBirth && (
                  <p>Dato født: {new Date(litter.dateOfBirth).toLocaleDateString()}</p>
                )}
              </Link>
            </LitterCard>
          </div>
        ))}
      </div>
    </LitterContainer>
  );
};

export default Litters;
