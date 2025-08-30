module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy CNAME file for GitHub Pages
  eleventyConfig.addPassthroughCopy("src/CNAME");
  
  // Copy SEO files
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Dodanie filtra date
  eleventyConfig.addFilter("year", function() {
    return new Date().getFullYear();
  });
  
  // Add date filter for sitemap
  eleventyConfig.addFilter("date", function(dateObj, format) {
    const date = new Date(dateObj);
    if (format === "%Y-%m-%d") {
      return date.toISOString().split('T')[0];
    }
    return date.toISOString();
  });
  
  // Add date manipulation filter for calendar
  eleventyConfig.addFilter("dateAdd", function(dateObj, amount, unit) {
    const date = new Date(dateObj);
    if (unit === 'months') {
      date.setMonth(date.getMonth() + amount);
    } else if (unit === 'days') {
      date.setDate(date.getDate() + amount);
    }
    return date;
  });
  
  // Configuration
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    xmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
}; 