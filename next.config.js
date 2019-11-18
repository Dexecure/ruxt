const prod = process.env.NODE_ENV === "production";
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    backend_url: "https://ruxt-api.dexecure.com",
    ga_id: prod ? "UA-55423842-6" : "UA-xxxxxxxx-x"
  }
});
