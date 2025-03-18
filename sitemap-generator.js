import { SitemapStream } from 'sitemap';  // Import the required methods
import fs from 'fs';
import { createWriteStream } from 'fs';

// Definer en liste med URL-er som skal være i sitemapen
const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/gallery', changefreq: 'weekly', priority: 0.9 },
  // Legg til flere sider etter behov
];

// Lag en stream for å generere sitemap
const stream = new SitemapStream({ hostname: 'https://shrikus.netlify.app' });
const writeStream = createWriteStream('./public/sitemap.xml');

// Handle the streaming process
stream.pipe(writeStream);

// Add URLs to the stream
urls.forEach(url => {
  stream.write(url);
});

// End the stream after adding all URLs
stream.end();

// Handle stream events
writeStream.on('finish', () => {
  console.log('Sitemap generert og lagret!');
});

writeStream.on('error', (error) => {
  console.error('Error generating sitemap:', error);
});
