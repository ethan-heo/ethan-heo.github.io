/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    notion_key: process.env.NEXT_PUBLIC_NOTION_KEY,
    notion_database: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
  },
};

module.exports = nextConfig;
