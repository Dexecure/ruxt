import ReactGA from "react-ga";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const initGA = () => {
  ReactGA.initialize(publicRuntimeConfig.ga_id);
};

export const logPageView = (
  pageName = window.location.pathname + window.location.search
) => {
  ReactGA.set({ page: pageName });
  ReactGA.pageview(pageName);
};
