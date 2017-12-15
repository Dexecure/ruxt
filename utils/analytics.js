import ReactGA from "react-ga";

const dev = process.env.NODE_ENV !== "production";

export const initGA = () => {
    ReactGA.initialize("UA-XXXXXX", {
        debug: dev,
    });
};

export const logPageView = (pageName = window.location.pathname + window.location.search) => {
    ReactGA.set({ page: pageName });
    ReactGA.pageview(pageName);
};

export default undefined;
