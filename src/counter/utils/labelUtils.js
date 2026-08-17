export const pageNameMap = {
  "/": "Hjem",
  "/dogs": "Våre hunder",
  "/litters": "Valpekull",
  "/gallery": "Galleri",
  "/about": "Om oss",
  "/contact": "Kontakt",
  "/PrivacyPolicy": "Personvern",
};

export const getPageLabel = (path, nameMap = {}) => {
  if (pageNameMap[path]) {
    return pageNameMap[path];
  }

  if (nameMap[path]) {
    return nameMap[path];
  }

  if (path.startsWith("/litters/")) {
    const id = path.split("/")[2];

    return `Kull (${id?.slice(0, 5)})`;
  }

  if (path.startsWith("/dogs/")) {
    const id = path.split("/")[2];

    return `Hund (${id?.slice(0, 5)})`;
  }

  if (path.startsWith("/gallery/")) {
    const id = path.split("/")[2];

    return `Album (${id?.slice(0, 5)})`;
  }

  return path;
};
