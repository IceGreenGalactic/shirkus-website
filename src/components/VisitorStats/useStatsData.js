import { useEffect, useState } from "react";
import sanityClient from "../../sanityClient";

const useStatsData = () => {
  const [totalVisits, setTotalVisits] = useState(null);
  const [uniqueIps, setUniqueIps] = useState(new Set());
  const [rawLogs, setRawLogs] = useState([]);
  const [dogNameMap, setDogNameMap] = useState({});
  const [litterNameMap, setLitterNameMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [visitorStats, logs] = await Promise.all([
        sanityClient.fetch(`*[_type == "siteStats"][0]{visitors}`),
        sanityClient.fetch(`*[_type == "visitorLog"]{ip, visits}`),
      ]);

      setTotalVisits(visitorStats.visitors || 0);
      setRawLogs(logs);

      const uniqueIps = new Set();
      const dogIds = new Set();
      const litterIds = new Set();

      logs.forEach((log) => {
        uniqueIps.add(log.ip);
        log.visits.forEach((visit) => {
          const page = visit.page;
          if (page.startsWith("/dogs/")) dogIds.add(page.split("/")[2]);
          if (page.startsWith("/litters/")) litterIds.add(page.split("/")[2]);
        });
      });

      setUniqueIps(uniqueIps);

      if (dogIds.size) {
        const dogData = await sanityClient.fetch(
          `*[_type == "dog" && _id in $ids]{ _id, name, nickname }`,
          { ids: [...dogIds] }
        );
        const map = {};
        dogData.forEach((dog) => {
          map[dog._id] = dog.nickname || dog.name || "Hund";
        });
        setDogNameMap(map);
      }

      if (litterIds.size) {
        const litterData = await sanityClient.fetch(
          `*[_type == "litter" && _id in $ids]{
            _id,
            mother { name, nickname, dogReference->{name, nickname} },
            father { name, nickname, dogReference->{name, nickname} }
          }`,
          { ids: [...litterIds] }
        );
        const map = {};
        litterData.forEach((litter) => {
          const mother =
            litter.mother.dogReference?.nickname ||
            litter.mother.dogReference?.name ||
            litter.mother.nickname ||
            litter.mother.name ||
            "Mor";

          const father =
            litter.father.dogReference?.nickname ||
            litter.father.dogReference?.name ||
            litter.father.nickname ||
            litter.father.name ||
            "Far";

          map[litter._id] = `${mother} & ${father}`;
        });
        setLitterNameMap(map);
      }
    };

    fetchData().catch(console.error);
  }, []);

  return {
    totalVisits,
    uniqueIps,
    rawLogs,
    dogNameMap,
    litterNameMap,
  };
};

export default useStatsData;
