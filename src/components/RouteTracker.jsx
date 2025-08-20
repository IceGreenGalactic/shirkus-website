import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto?.randomUUID?.() ?? (Math.random().toString(36).slice(2) + Date.now());
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

const FIVE_HOURS = 1000 * 60 * 60 * 5;

const RouteTracker = () => {
  const location = useLocation();
  const sentThisMount = useRef(new Set());

  useEffect(() => {
    const page = location.pathname;

    if (sentThisMount.current.has(page)) return;
    sentThisMount.current.add(page);

    // (valgfritt) 5-timers klientbuffer per side
    const key = `lastVisitTime:${page}`;
    const last = localStorage.getItem(key);
    const now = Date.now();
    if (last && now - parseInt(last, 10) < FIVE_HOURS) return;

    const deviceId = getOrCreateDeviceId();

    fetch('/.netlify/functions/incrementVisitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, deviceId }),
    })
      .then(() => localStorage.setItem(key, now.toString()))
      .catch(err => console.error('Feil ved telling av besøk:', err));
  }, [location]);

  return null;
};

export default RouteTracker;
