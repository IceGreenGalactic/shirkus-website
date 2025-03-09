import React, { useState, useEffect, useRef } from "react";
import { HeaderContainer, HeroText, NavContainer } from "./Header.styled";
import backgroundImage from "../../assets/images/ShirkusHeader2.jpg";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import sanityClient from "../../sanityClient";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeLitter, setActiveLitter] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter"]{
          _id,
          dateOfBirth
        }`
      )
      .then((data) => {
        const today = new Date();
        const newLitters = data.filter((litter) => {
          if (!litter.dateOfBirth) return false;
          const birthDate = new Date(litter.dateOfBirth);
          const diffDays = (today - birthDate) / (1000 * 60 * 60 * 24);
          return diffDays < 70;
        });

        if (newLitters.length > 0) {
          setActiveLitter(newLitters[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleLinkClick = () => {
    setIsNavOpen(false);
  };

  const handleDropdownClick = (sectionId) => {
    setActiveDropdown(sectionId);
    setIsNavOpen(false); // Lukk menyen etter klikk

    if (location.pathname !== "/dogs") {
      navigate("/dogs"); // Naviger først til /dogs
      setTimeout(() => scrollToSection(sectionId), 300); // Deretter skroll
    } else {
      scrollToSection(sectionId); // Hvis allerede på /dogs, skroll direkte
    }
  };

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const isOnDogsPage = location.pathname === "/dogs";

        const isDesktop = window.innerWidth >= 992;
        let yOffset;

        if (isOnDogsPage) {
          yOffset = isDesktop ? -10 : -300;
        } else {
          yOffset = isDesktop ? -20 : -100;
        }

        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <HeaderContainer>
        <img
          src={backgroundImage}
          alt="Hero Image of five poodles sitting in the grass"
          className="hero-image"
        />
        <HeroText className="col-12 m-auto text-center d-none d-lg-block py-2">
          Kennel Shirkus
        </HeroText>
      </HeaderContainer>

      <NavContainer>
        <Navbar expand="lg" className="navbar" ref={navbarRef}>
          <Container className="d-flex justify-content-between align-items-center col-lg-10">
            <div className="mobile-header d-lg-none d-flex flex-row-reverse align-items-center justify-content-center w-100">
              <HeroText className="m-0 justify-content-center m-auto">
                Kennel Shirkus
              </HeroText>
              <Navbar.Toggle
                aria-controls="navbar-nav"
                onClick={() => setIsNavOpen(!isNavOpen)}
              />
            </div>

            <Navbar.Collapse id="navbar-nav" in={isNavOpen}>
              <Nav className="w-100 d-lg-flex justify-content-between fs-5 mb-lg-1">
                <NavLink to="/" onClick={handleLinkClick} className="nav-link">
                  Hjem
                </NavLink>

                {activeLitter && (
                  <NavLink
                    to={`/litters`}
                    onClick={handleLinkClick}
                    className="nav-link text-warning"
                  >
                    🐶 Nytt valpekull!
                  </NavLink>
                )}

                <NavDropdown title="Våre hunder" id="nav-dropdown">
                  <NavDropdown.Item
                    as={NavLink}
                    to="/dogs#current"
                    onClick={() => handleDropdownClick("current")}
                    className={
                      activeDropdown === "current" ? "active-dropdown" : ""
                    }
                  >
                    Alle hundene
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/dogs#breeding"
                    onClick={() => handleDropdownClick("breeding")}
                    className={
                      activeDropdown === "breeding" ? "active-dropdown" : ""
                    }
                  >
                    Avlshunder
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="/dogs#deceased"
                    onClick={() => handleDropdownClick("deceased")}
                    className={
                      activeDropdown === "deceased" ? "active-dropdown" : ""
                    }
                  >
                    Tidligere hunder
                  </NavDropdown.Item>
                </NavDropdown>

                <NavLink
                  to="/litters"
                  onClick={handleLinkClick}
                  className="nav-link"
                >
                  Valpekull
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={handleLinkClick}
                  className="nav-link"
                >
                  Om oss
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={handleLinkClick}
                  className="nav-link"
                >
                  Kontakt
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </NavContainer>
    </>
  );
};

export default Header;
