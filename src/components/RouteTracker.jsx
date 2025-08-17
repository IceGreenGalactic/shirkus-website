import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = () => {
  const location = useLocation();
  const calledRef = useRef(new Set());

  useEffect(() => {
    const page = location.pathname;

    if (calledRef.current.has(page)) return;
    calledRef.current.add(page);

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
