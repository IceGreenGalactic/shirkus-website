export const pageNameMap = {
  "/litters": "Valpekull",
  "/dogs": "Våre hunder",
  "/gallery": "Galleri",
  "/about": "Om oss",
  "/contact": "Kontakt",
  "/": "Hjem",
};

export const getPageLabel = (path, litterNameMap, dogNameMap) => {
  if (pageNameMap[path]) return pageNameMap[path];

  if (path.startsWith("/litters/")) {
    const id = path.split("/")[2];
    return litterNameMap?.[id] || `Kull (${id.slice(0, 5)})`;
  }

  if (path.startsWith("/dogs/")) {
    const id = path.split("/")[2];
    return dogNameMap?.[id] || `Hund (${id.slice(0, 5)})`;
  }

  return path;
};
