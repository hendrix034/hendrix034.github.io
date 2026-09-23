/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves plain files, so build a static site into ./out
  output: 'export',
  // Next.js image optimization needs a server; Pages has none.
  images: { unoptimized: true },
}

module.exports = nextConfig
