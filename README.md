# 🐕 Kennel Website

![Screenshot](/src/assets/images/Screenshot%20KennelShirkus.png)

Live: [shirkus.no](https://shirkus.no)

A production website for a Norwegian kennel built with **React (Vite)** and **Sanity** as a headless CMS.  
Breeders manage dogs, litters, galleries, and site info in Sanity. The frontend fetches this content dynamically and auto-generates pages and navigation. New litters appear in the header automatically, and dogs/litters are linked and sortable.

Includes responsive layout, lightbox gallery, breadcrumbs, and basic SEO.

---

## ✨ Features
- Dynamic content from Sanity (dogs, litters, galleries, site info)  
- Auto-generated navigation (new litters show up in the menu)  
- Responsive design optimized for mobile and desktop  
- Image lightbox gallery  
- Breadcrumbs for easy navigation  
- SEO meta handling with React Helmet  
- Visitor stats logging  

---

## 📄 Sanity Models
### Dog
- Name, nickname, breed, color, gender  
- Dog type (Current, Breeding, Former)  
- Birthdate and possible death date  
- Health information  
- Images and gallery  
- Pedigree  

### Litter
- Information about mother and father  
- Birthdate / Expected birthdate  
- Details about puppies (count, color, gender)  
- Images and gallery from different weeks  
- Litter description  

---

## 🛠 Built With
- React (Vite)  
- Sanity (headless CMS)  
- React Router  
- Styled Components  
- React Bootstrap  
- Yet-Another-React-Lightbox  

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Sanity CLI (for managing CMS)

### Installing

1. Clone the repo:

```bash
git clone https://github.com/IceGreenGalactic/shirkus-website.git
cd shirkus-website
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your Sanity project settings:

```bash
VITE_SANITY_PROJECT_ID=your-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

4. Run locally:

```bash
npm run dev
```

---

The website will now be available at `http://localhost:5173/`.

## License

This project is private and not open for commercial use without permission.

---

## 📫 Contact

GitHub: [IceGreenGalactic](https://github.com/IceGreenGalactic)  
LinkedIn: [Kristine Tyrholm](https://www.linkedin.com/in/kristine-tyrholm/)
