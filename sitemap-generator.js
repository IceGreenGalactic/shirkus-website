import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';

// Define a list of static URLs
const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/dogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/litters', changefreq: 'weekly', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/gallery', changefreq: 'weekly', priority: 0.9 },
];

// Simulated dynamic pages (replace with real slugs)
const dogSlugs = ['bella', 'max', 'rocky']; // Example dog pages
const litterSlugs = ['litter-a', 'litter-b']; // Example litter pages
const gallerySlugs = ['image1', 'image2']; // Example gallery pages

// Generate URLs dynamically
dogSlugs.forEach(slug => urls.push({ url: `/dogs/${slug}`, changefreq: 'monthly', priority: 0.7 }));
litterSlugs.forEach(slug => urls.push({ url: `/litters/${slug}`, changefreq: 'monthly', priority: 0.7 }));
gallerySlugs.forEach(slug => urls.push({ url: `/gallery/${slug}`, changefreq: 'monthly', priority: 0.7 }));

// Create a stream for the sitemap
const stream = new SitemapStream({ hostname: 'https://shirkus.no' });
const writeStream = createWriteStream('./public/sitemap.xml');

// Pipe the stream
stream.pipe(writeStream);

// Add URLs to the stream
urls.forEach(url => stream.write(url));

// End the stream
stream.end();

// Handle events
writeStream.on('finish', () => console.log('✅ Sitemap generated and saved!'));
writeStream.on('error', error => console.error('❌ Error generating sitemap:', error));
