const prod = process.env.NODE_ENV === "production";

module.exports = {
  "process.env.BACKEND_URL": prod ? "https://ruxt-api.dexecure.com" : "https://ruxt-api.dexecure.com",
  "process.env.GA_ID": prod ? "UA-55423842-6" : "UA-xxxxxxxx-x",
};
