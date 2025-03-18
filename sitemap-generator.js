import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch'; // If you're fetching dynamic content

const hostname = 'https://shirkus.no';

// Static routes
const staticUrls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/dogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/litters', changefreq: 'weekly', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/gallery', changefreq: 'weekly', priority: 0.9 },
];

async function generateSitemap() {
  const stream = new SitemapStream({ hostname });
  const writeStream = createWriteStream('./public/sitemap.xml');
  stream.pipe(writeStream);

  // Add static URLs
  staticUrls.forEach(url => stream.write(url));

  try {
    // Fetch dynamic content (example for dogs, litters, and gallery)
    const [dogs, litters, galleries] = await Promise.all([
      fetch(`${hostname}/api/dogs`).then(res => res.json()),
      fetch(`${hostname}/api/litters`).then(res => res.json()),
      fetch(`${hostname}/api/gallery`).then(res => res.json()),
    ]);

    // Add dynamic dog pages
    dogs.forEach(dog => stream.write({ url: `/dogs/${dog.slug}`, changefreq: 'monthly', priority: 0.7 }));

    // Add dynamic litter pages
    litters.forEach(litter => stream.write({ url: `/litters/${litter.slug}`, changefreq: 'monthly', priority: 0.7 }));

    // Add dynamic gallery pages
    galleries.forEach(image => stream.write({ url: `/gallery/${image.slug}`, changefreq: 'monthly', priority: 0.7 }));

  } catch (error) {
    console.error("Error fetching dynamic content:", error);
  }

  stream.end();
  writeStream.on('finish', () => console.log('✅ Sitemap generated successfully!'));
}

generateSitemap();
