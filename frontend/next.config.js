/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    //output: "export",
    // distDir: "out",
    basePath: isDev ? "" : "/sep2025-project-team_006",
    // assetPrefix: "/sep2025-project-team_006/",
    images: {
        unoptimized: true,
    },
};
module.exports = nextConfig;