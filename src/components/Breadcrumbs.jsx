import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { StyledBreadcrumb, StyledBreadcrumbItem } from "./Breadcrumbs.styled";

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();

  const pathnames = useMemo(() => location.pathname.split("/").filter((x) => x), [location.pathname]);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {

      const query = pathnames[0] === "hunder"
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
      <StyledBreadcrumbItem
        as={Link}
        to="/"
        className={location.pathname === "/" ? "active" : ""}
      >
        Hjem
      </StyledBreadcrumbItem>

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        let displayName = decodeURIComponent(
          segment.charAt(0).toUpperCase() + segment.slice(1)
        );

        if (pathnames[0] === "hunder" && segment === id && data) {
          displayName = data.nickname || data.name;
        }

        if (pathnames[0] === "valper" && segment === id && data) {
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