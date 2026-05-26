/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://unifirolabs.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*']
}