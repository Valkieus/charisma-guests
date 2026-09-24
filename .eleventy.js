module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ admin: "admin" });
  eleventyConfig.addPassthroughCopy({ uploads: "uploads" });
  eleventyConfig.addPassthroughCopy({ "site/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "site/app.js": "app.js" });

  eleventyConfig.addCollection("invite", (api) =>
    api
      .getFilteredByTag("invite")
      .sort((a, b) => (a.data.nom || "").localeCompare(b.data.nom || ""))
  );

  return {
    dir: {
      input: "site",
      includes: "_includes",
      output: "_site",
    },
  };
};
