const config = require("./config");

module.exports = {
  publicPath: config.publicPath,
  assetsDir: "",
  outputDir: "dist",
  pages: {
    index: {
      entry: "src/main.js",
      title: config.title,
    },
  },
};
