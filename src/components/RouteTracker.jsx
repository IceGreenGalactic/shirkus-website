// src/components/RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname;

    fetch('/.netlify/functions/incrementVisitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page }),
    }).catch((err) => {
      console.error("Feil ved telling av besøk:", err);
    });
  }, [location]);

  return null; 
};

export default RouteTracker;
