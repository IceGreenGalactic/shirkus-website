import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "../analytics/posthog";

export default function TrackAllRoutes() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
      pathname,
    });
  }, [pathname, search]);

  return null;
}