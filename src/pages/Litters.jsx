import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { LitterCard, LitterContainer } from "./Litters.styled";
import { urlFor } from "../utils/sanityImage";

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
        const upcomingLitters = data.filter((litter) => !litter.dateOfBirth);
        const pastLitters = data
          .filter((litter) => litter.dateOfBirth)
          .sort((a, b) => new Date(b.dateOfBirth) - new Date(a.dateOfBirth));

        console.log("Upcoming Litters:", upcomingLitters);
        console.log("Past Litters:", pastLitters);

        setLitters([...upcomingLitters, ...pastLitters]);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  // Function to check if the litter is less than 10 weeks old
  const isNewLitter = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const diffTime = today - birthDate; 
    const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    console.log("Diff in Days:", diffDays);
    return diffDays < 70; // 70 days = 10 weeks
  };

  // Separate new litters from past litters
  const newLitters = litters
    .filter((litter) => litter.dateOfBirth && isNewLitter(litter.dateOfBirth));

  const pastLitters = litters
    .filter((litter) => litter.dateOfBirth && !isNewLitter(litter.dateOfBirth));

  return (
    <LitterContainer className="col-10 col-md-10">
      {/* Check for upcoming litters */}
      {litters.some((litter) => !litter.dateOfBirth) && (
        <div className="row g-4 costum-border pb-4">
          <h2 className="text-center">Kommende Valper</h2>
          {litters
            .filter((litter) => !litter.dateOfBirth)
            .map((litter) => (
              <div
                key={litter._id}
                className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto mb-4"
              >
                <LitterCard>
                  <Link to={`/valper/${litter._id}`}>
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
                    {litter.expectedDateOfBirth && (
                      <p>
                        Forventes:{" "}
                        {new Date(
                          litter.expectedDateOfBirth
                        ).toLocaleDateString("no-NO", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </Link>
                </LitterCard>
              </div>
            ))}
        </div>
      )}

      {/* Check for new litters */}
      {newLitters.length > 0 && (
        <div className="row g-4 costum-border pb-4">
          <h2 className="text-center">Valpekull</h2>
          {newLitters.map((litter) => (
            <div
              key={litter._id}
              className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto"
            >
              <LitterCard>
                <Link to={`/valper/${litter._id}`}>
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
                  {litter.puppyCount && (
                    <p>Antall valper: {litter.puppyCount}</p>
                  )}
                  {litter.dateOfBirth && (
                    <p>
                      Dato født:{" "}
                      {new Date(litter.dateOfBirth).toLocaleDateString(
                        "no-NO",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )}
                    </p>
                  )}
                </Link>
              </LitterCard>
            </div>
          ))}
        </div>
      )}

      {/* Check for past litters */}
      {pastLitters.length > 0 && (
        <div className="row g-4 costum-border pb-4">
          <h2 className="text-center">Tidligere valpekull</h2>
          {pastLitters.map((litter) => (
            <div
              key={litter._id}
              className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto"
            >
              <LitterCard>
                <Link to={`/valper/${litter._id}`}>
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
                  {litter.puppyCount && (
                    <p>Antall valper: {litter.puppyCount}</p>
                  )}
                  {litter.dateOfBirth && (
                    <p>
                      Dato født:{" "}
                      {new Date(litter.dateOfBirth).toLocaleDateString(
                        "no-NO",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )}
                    </p>
                  )}
                </Link>
              </LitterCard>
            </div>
          ))}
        </div>
      )}
    </LitterContainer>
  );
};

export default Litters;
