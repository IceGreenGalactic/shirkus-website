import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { LitterCard, LitterContainer } from "./Litters.styled";
import { urlFor } from "../utils/sanityImage"; // Importer urlFor for å generere bildelenker

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
            "image": image { asset-> { _id, _ref }, crop, hotspot }
          },
          father {
            name,
            nickname,
            "image": image { asset-> { _id, _ref }, crop, hotspot } 
          },
          expectedPuppies,
          puppyCount,
          dateOfBirth,
          expectedDateOfBirth
        }`
      )
      .then((data) => {
        console.log(data); // Logg data for feilsøking
        const upcomingLitters = data.filter((litter) => !litter.dateOfBirth);
        const pastLitters = data.filter((litter) => litter.dateOfBirth);
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
    <LitterContainer className="container mt-2">
      <h2 className="mb-4">Kull</h2>
      <div className="row g-4">
        {litters.map((litter) => (
          <div
            key={litter._id}
            className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto"
          >
            <LitterCard>
              <Link to={`/litters/${litter._id}`}>
                <h3>
                  {litter.mother.nickname} & {litter.father.nickname}
                </h3>
                <div className="d-flex justify-content-center mb-2">
                  {litter.mother.image && (
                    <img
                      src={urlFor(litter.mother.image)}
                      alt={litter.mother.nickname}
                      className="img-fluid"
                      style={{ marginRight: "1%" }}
                    />
                  )}
                  {litter.father.image && (
                    <img
                      src={urlFor(litter.father.image)}
                      alt={litter.father.nickname}
                      className="img-fluid"
                    />
                  )}
                </div>
  
                {litter.expectedPuppies && (
                  <p>Forventede valper: {litter.expectedPuppies}</p>
                )}
                {litter.puppyCount && <p>Antall valper: {litter.puppyCount}</p>}
                {litter.dateOfBirth && (
                  <p>
                    Dato født:
                    {new Date(litter.dateOfBirth).toLocaleDateString("no-NO", {
                      day: '2-digit',  
                      month: '2-digit', 
                      year: 'numeric'
                    })}
                  </p>
                )}
                {!litter.dateOfBirth && litter.expectedDateOfBirth && (
                  <p>
                    Forventes:
                    {new Date(litter.expectedDateOfBirth).toLocaleDateString(
                      "no-NO",
                      {
                        month: 'long', 
                        year: 'numeric'   
                      }
                    )}
                  </p>
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
