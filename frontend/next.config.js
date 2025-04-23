/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    // UNCOMMENT THESE FOR A STATIC SITE EXPORT!
    // This would allow us to host on GitHub Pages again, but is largely incompatible with current frontend structure.
    // HEED THY WARNING
    output: "standalone",
    distDir: "out",
    basePath: "",
    // assetPrefix: "/sep2025-project-team_006/",
    images: {
        unoptimized: true,
    },
};
module.exports = nextConfig;