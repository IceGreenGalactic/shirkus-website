import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { StyledBreadcrumb, StyledBreadcrumbItem } from "./Breadcrumbs.styled";

// Translate path segments to Norwegian
const pathTranslations = {
  dogs: "Våre hunder",
  litters: "Valpekull",
  about: "Om oss",
  contact: "Kontakt",
};

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();

  const pathnames = useMemo(() => location.pathname.split("/").filter((x) => x), [location.pathname]);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      const query = pathnames[0] === "dogs"
        ? `*[_type == "dog" && _id == $id]{ _id, name, nickname }`
        : `*[_type == "litter" && _id == $id]{ _id, mother { nickname }, father { nickname } }`;

      sanityClient
        .fetch(query, { id })
        .then((data) => {
          if (data && data.length > 0) {
            setData(data[0]);
          } else {
            console.error("No data found for ID:", id);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id, pathnames]);

  return (
    <StyledBreadcrumb>
    {location.pathname !== "/" && (
      <>
        <StyledBreadcrumbItem as={Link} to="/">
          Hjem
        </StyledBreadcrumbItem>
      </>
    )}

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        let displayName = pathTranslations[segment] || decodeURIComponent(
          segment.charAt(0).toUpperCase() + segment.slice(1)
        );

        // Show the dog's nickname or name in the breadcrumbs
        if (pathnames[0] === "dogs" && segment === id && data) {
          displayName = data.nickname || data.name;
        }

        // Show the litter's mother and father names
        if (pathnames[0] === "litters" && segment === id && data) {
          const motherNickname = data.mother?.nickname || data.mother?.name;
          const fatherNickname = data.father?.nickname || data.father?.name;
          displayName = ` ${motherNickname} & ${fatherNickname}`;
        }

        return (
          <React.Fragment key={to}>
            <span className="separator"> / </span>
            <StyledBreadcrumbItem
              as={Link}
              to={to}
              className={location.pathname === to ? "active pointer" : ""}
            >
              {displayName}
            </StyledBreadcrumbItem>
          </React.Fragment>
        );
      })}
    </StyledBreadcrumb>
  );
};

export default DynamicBreadcrumbs;
