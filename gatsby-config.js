/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `palp-home-gatsby`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: ["gatsby-plugin-postcss","gatsby-plugin-root-import",{
    resolve: 'gatsby-plugin-react-leaflet',
    options: {
      linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
    }
  }]
};