import React from "react";
import Human from "./human";

class Explanation extends React.Component {
  render() {
    return (
      <div className="explanation__wrapper">
        <div className="explanation__row">
          <div className="explanation__item">
            <div className="explanation__header">
              <span className="explanation__text">How to use the tool</span>
            </div>
            <div className="explanation__section">
              <span className="explanation__text">
                - Select a website using the autocomplete.
                <br />
                - (Optional) select a device and connection type. <br />- Use
                the time slider to select the user wait time.
              </span>
            </div>
          </div>
          <div className="explanation__item">
            <div className="explanation__header">
              <span className="explanation__text">
                Assume 1000 website visitors
              </span>
            </div>
            <div className="explanation__section">
              <span className="explanation__text">
                - <Human color="#ffffff" /> : no content loaded,
                <br />
                - <Human color="#5486AA" /> : some content loaded,
                <br />
                - <Human color="#153B58" /> : document loaded.
              </span>
            </div>
          </div>
        </div>
        <div className="explanation__header">
          <span className="explanation__text">Metrics</span>
        </div>
        <div className="explanation__section">
          <span className="explanation__text">
            -{" "}
            <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/#diving-into-the-important-questions-wheee">
              Site Experience Benchmark (SEB)
            </a>{" "}
            score: the fraction of users completing first contentful paint
            within first second.
            <br />- The percentage of users completing{" "}
            <a href="https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics#first_paint_and_first_contentful_paint">
              first contentful paint
            </a>{" "}
            within given time.
            <br />
            - The percentage of users completing document load within given
            time.
            <br />
          </span>
        </div>
        <div className="explanation__header">
          <span className="explanation__text">Learn more</span>
        </div>
        <div className="explanation__section">
          <span className="explanation__text">
            - Read more on CrUX and the metrics for user experience in{" "}
            <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/">
              the introductory article on CrUX
            </a>
            .<br />- Contribute at{" "}
            <a href="https://github.com/dexecure/ruxt">GitHub</a>. Suggestions
            welcome.
            <br />- Reach out at{" "}
            <a href="mailto:coffee@dexecure.com">coffee@dexecure.com</a>.
          </span>
        </div>
      </div>
    );
  }
}

export default Explanation;
