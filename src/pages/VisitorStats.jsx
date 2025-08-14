import { useEffect, useState } from "react";
import sanityClient from "../sanityClient";

const VisitorStats = () => {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    sanityClient.fetch(`*[_type == "siteStats"][0]{visitors}`).then((data) => {
      setVisits(data.visitors);
    });
  }, []);

  return (
    <div className="text-center" style={{ padding: "2rem" }}>
      <h2>Antall besøkende:</h2>
      {visits !== null ? <p>{visits}</p> : <p>Laster...</p>}
    </div>
  );
};

export default VisitorStats;
