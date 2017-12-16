module.exports = {
  webpack: (config) => {
    // Perform customizations to config
    config.module.rules = config.module.rules.map(rule => {
      if(rule.loader === "babel-loader") {
        rule.options.cacheDirectory = false;
      }
      return rule;
    });

    return config;
  },
};

