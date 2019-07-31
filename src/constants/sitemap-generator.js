require("babel-register")({
    presets: ["es2015", "react"]
  });

  require.extensions['.css'] = function () {
    return null;
  };

  require.extensions['.jpg'] = () => {};
require.extensions['.jpeg'] = () => {};
require.extensions['.gif'] = () => {};
require.extensions['.png'] = () => {};
require.extensions['.svg'] = () => {};
   
  const router = require("./sitemap-routes").default;
  const Sitemap = require("react-router-sitemap").default;
  
  function generateSitemap() {
      return (
        new Sitemap(router)
            .build("https://www.thefittoform.com")
            .save("./public/sitemap.xml")
      );
  }
  
  generateSitemap();