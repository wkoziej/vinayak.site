module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy CNAME file for GitHub Pages
  eleventyConfig.addPassthroughCopy("src/CNAME");
  
  // Dodanie filtra date
  eleventyConfig.addFilter("year", function() {
    return new Date().getFullYear();
  });
  
  // Configuration
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/vinayak.site/"
  };
}; 