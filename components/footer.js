import React from "react";
import Typekit from "react-typekit";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer--content l">
        <p>
          Data from{" "}
          <a href="https://developers.google.com/web/tools/chrome-user-experience-report/">
            CrUX
          </a>
          . Made with <span style={{ color: "#db3340" }}>❤</span> by{" "}
          <a href="https://dexecure.com">Dexecure</a>.
        </p>
        <Typekit kitId="rgu6gkq" />
      </div>
    );
  }
}

export default Footer;
