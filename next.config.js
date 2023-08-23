/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    notion_key: process.env.NOTION_KEY,
    notion_database: process.env.NOTION_DATABASE_ID,
  },
};

module.exports = nextConfig;
