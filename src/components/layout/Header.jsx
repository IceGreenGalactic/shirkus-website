import React, { useState, useEffect, useRef } from "react";
import { HeaderContainer, HeroText, NavContainer } from "./Header.styled";
import backgroundImage from "../../assets/images/ShirkusHeader2.jpg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import sanityClient from "../../sanityClient";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLitter, setActiveLitter] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [activeLink, setActiveLink] = useState(""); // 🔥 Holder styr på aktiv lenke
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

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // 🔥 Sett aktiv lenke basert på klikk
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    setActiveDropdown("");
  };

  const handleDropdownClick = (sectionId) => {
    setActiveDropdown(sectionId);
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    if (location.pathname !== "/dogs") {
      navigate("/dogs");
      setTimeout(() => scrollToSection(sectionId), 300);
    } else {
      scrollToSection(sectionId);
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
      if (
        !navbarRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-menu")
      ) {
        setIsDropdownOpen(false);
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
          <a href="/"> Kennel Shirkus</a>
        </HeroText>
      </HeaderContainer>

      <NavContainer ref={navbarRef}>
        <Navbar expand="lg" className="navbar">
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
                <NavLink
                  to="/"
                  onClick={() => handleLinkClick("hjem")}
                  className={`nav-link ${activeLink === "hjem" ? "active" : ""}`}
                >
                  Hjem
                </NavLink>

                {activeLitter && (
                  <NavLink
                    to={`/litters/${activeLitter._id}`}
                    key={activeLitter._id}
                    onClick={() => handleLinkClick("nytt-kull")}
                    className={`nav-link text-warning ${
                      activeLink === "nytt-kull" ? "nytt-kull" : ""
                    }`}
                  >
                    🐶 Nytt valpekull!
                  </NavLink>
                )}

                <div className="nav-item dropdown">
                  <NavLink
                    to="/dogs"
                    className="nav-link dropdown-toggle"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Våre hunder
                  </NavLink>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/dogs#current"
                        onClick={() => handleDropdownClick("current")}
                      >
                        Alle hundene
                      </Link>
                      <Link
                        to="/dogs#breeding"
                        onClick={() => handleDropdownClick("breeding")}
                      >
                        Avlshunder
                      </Link>
                      <Link
                        to="/dogs#deceased"
                        onClick={() => handleDropdownClick("deceased")}
                      >
                        Tidligere hunder
                      </Link>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/litters"
                  onClick={() => handleLinkClick("valpekull")}
                  className={`valpekull nav-link ${
                    activeLink === "nytt-kull" ? "no-active" : ""
                  }`}
                >
                  Valpekull
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => handleLinkClick("om-oss")}
                  className={`nav-link ${activeLink === "om-oss" ? "active" : ""}`}
                >
                  Om oss
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => handleLinkClick("kontakt")}
                  className={`nav-link ${activeLink === "kontakt" ? "active" : ""}`}
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
