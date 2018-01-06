import React from "react";
import qs from "qs";
import Router from "next/router";
import Meta from "../components/meta";
import Autosuggest from "react-autosuggest";
import Select from "react-select";
import Slider from "react-rangeslider";
import { debounce } from "underscore";
import { PulseLoader } from "react-spinners";
import Visual from "../components/visual";
import Human from "../components/human";

const humanCount = 1000;
const defaultUrl = "https://google.com";
const devAndconDefault = "all";
const deviceList = [
  { value: "all", label: "All device types" },
  { value: "phone", label: "Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "desktop", label: "Desktop" },
];
const connectionList = [
  { value: "all", label: "All connection types" },
  { value: "4G", label: "4G" },
  { value: "3G", label: "3G" },
  { value: "2G", label: "2G" },
  { value: "slow-2G", label: "slow-2G" },
  { value: "offline", label: "offline" },
];

class CompareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlSuggestions: [],
      url: defaultUrl,
      url1: defaultUrl,
      url2: defaultUrl,
      device: devAndconDefault,
      connection: devAndconDefault,
      time: 1,
      loadingHumanCount1: humanCount,
      loadingHumanCount2: humanCount,
      fcp1: null,
      onload1: null,
      fcpHumanCount1: 0,
      onloadHumanCount1: 0,
      fcp2: null,
      onload2: null,
      fcpHumanCount2: 0,
      onloadHumanCount2: 0,
      loading: false,
      checked: true
    };

    this.handleOnURLChange = this.handleOnURLChange.bind(this);
    this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
    this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
    this.handleGetOrigins = this.handleGetOrigins.bind(this);
    this.handleOnTimeChange = this.handleOnTimeChange.bind(this);
    this.handleUpdateNumbers = this.handleUpdateNumbers.bind(this);
    this.handleUpdateHumanCount = this.handleUpdateHumanCount.bind(this);
    this.onUrlSuggestionsFetchRequested = this.onUrlSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.debouncedLoadSuggestions = debounce(this.loadSuggestionsFromServer, 500);
  }

  componentDidMount() {
    const newURL = window.location.pathname;
    const { device, connection, url1, url2, time } = Router.query;
    if (url1 || url2) {
      this.setState({
        url: url1,
        url1: url1,
        url2: url2
      });
      this.handleUpdateNumbers(url1, device, connection).then(()=> {
        this.setState({
          url: url2
        });
        this.handleUpdateNumbers(url2, device, connection);
      });
    } else {
      Router.push(newURL, newURL, { shallow: true });
    }
  }

  handleOnURLChange(event, { newValue }) {
    const originUrl = { newValue };
    if(event.target.id === 'url1') {
      this.setState({
        url: originUrl.newValue,
        url1: originUrl.newValue
      });
    } else if(event.target.id === 'url2') {
      this.setState({
        url: originUrl.newValue,
        url2: originUrl.newValue,
      });
    }

    // update the url
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url: originUrl.newValue, device: device ? device : devAndconDefault,
        connection: connection ? connection : devAndconDefault }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnDeviceChange(selectedOption) {
    this.setState({
      device: selectedOption,
    });
    const urlQuery = this.state.url1 === defaultUrl ? this.state.url2 : this.state.url1;
    this.handleUpdateNumbers(
      urlQuery,
      selectedOption.value,
      this.state.connection,
    );
    const { device, connection, url, time } = Router.query;
    const newURL = Window.location.pathname + "?" +
      qs.stringify({ url, device: selectedOption.value, connection }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnConnectionChange(selectedOption) {
    this.setState({
      connection: selectedOption,
    });
    if ((this.state.url) || (!(this.state.url = defaultUrl))) {
      this.handleUpdateNumbers(
        this.state.url,
        this.state.device,
        selectedOption.value
      );
    }
    const {
      device,
      connection,
      url,
      time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url, device, connection: selectedOption.value }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnTimeChange(selectedOption) {
    if (typeof(selectedOption) === "number") {
      this.setState({
        time: selectedOption
      });
    }
    this.handleUpdateHumanCount(this.state.fcp, this.state.onload, selectedOption);
  }

  handleGetOrigins(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }
    return fetch(`${process.env.BACKEND_URL}/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: input
      }),
    })
      .then(response => response.json())
      .then(json => ({ options: json }));
  }

  async handleUpdateNumbers(url, device, connection) {
    console.log(url, device, connection);
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      // doesnt seem to be a valid url
      return;
    }
    this.setState({
      loading: true,
    });
    const origin = url.origin || url;
    const response = await fetch(`${process.env.BACKEND_URL}/content`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin,
        device,
        connection,
      }),
    });

    if (response.ok) {
      const responseJSON = await response.json();
      if (this.state.url === this.state.url1) {
        this.setState({
          fcp1: responseJSON.bam.fcp,
          onload1: responseJSON.bam.onload,
          loading: false,
        });
        this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
      } else if (this.state.url === this.state.url2) {
        this.setState({
          fcp2: responseJSON.bam.fcp,
          onload2: responseJSON.bam.onload,
          loading: false,
        });
        this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
      }
    } else {
      // probably origin doesn't exist
      this.setState({
        onloadHumanCount1: 0,
        fcpHumanCount1: 0,
        onloadHumanCount2: 0,
        fcpHumanCount2: 0,
        loadingHumanCount: humanCount,
        loading: false,
      });
    }
  }

  handleUpdateHumanCount(fcp, onload, time) {
    if (time === 0) {
      this.setState({
        onloadHumanCount1: 0,
        fcpHumanCount1: 0,
        onloadHumanCount2: 0,
        fcpHumanCount2: 0,
        loadingHumanCount: humanCount,
      });
      return;
    }

    let onloadHumanCount = 0;
    let fcpHumanCount = 0;
    let onload_prob = 0;
    let fcp_prob = 0;

    if (onload) {
      onload_prob = onload[time];
      onloadHumanCount = Math.max(0, Math.floor(onload_prob*humanCount));
    }

    if (fcp) {
      fcp_prob = fcp[time];
      fcpHumanCount = Math.max(0, Math.floor((fcp_prob-onload_prob)*humanCount));
    }

    const loadingHumanCount = Math.max(0, Math.floor(humanCount - fcp_prob*humanCount));

    if (this.state.url === this.state.url1) {
      this.setState({
        onloadHumanCount1: onloadHumanCount,
        fcpHumanCount1: fcpHumanCount,
        loadingHumanCount1: loadingHumanCount,
      });
    } else if (this.state.url === this.state.url2) {
      this.setState({
        onloadHumanCount2: onloadHumanCount,
        fcpHumanCount2: fcpHumanCount,
        loadingHumanCount2: loadingHumanCount,
      });
    }
  }

  async onSuggestionSelected(event, { suggestion }) {
    this.handleUpdateNumbers(
      suggestion.origin,
      this.state.device,
      this.state.connection,
    );
  }

  async loadSuggestionsFromServer(value) {
    const urls = await this.handleGetOrigins(value);
    this.setState({
      urlSuggestions: urls.options,
    });
  }

  onUrlSuggestionsFetchRequested({ value }) {
    this.debouncedLoadSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      urlSuggestions: [],
    });
  }

  getUrlSuggestionValue(url) {
    return url.origin;
  }

  renderUrl1Suggestion(url) {
    return (
      <span id="url1">{url.origin}</span>
    );
  }

  renderUrl2Suggestion(url) {
    return (
      <span id="url2">{url.origin}</span>
    );
  }

  handleToggleClick(event) {
    const newURL = '/';
    Router.push(newURL, newURL, { shallow: true });
  }

  render() {
    const urlPlaceholder = defaultUrl;
    const formatsecond = value => `${value} s`;
    const inputProps1 = {
      placeholder: urlPlaceholder,
      value: this.state.url1,
      onFocus: (ev) => {
        ev.target.select();
      },
      id: "url1",
      onChange: this.handleOnURLChange,
    };
    const inputProps2 = {
      placeholder: urlPlaceholder,
      value: this.state.url2,
      onFocus: (ev) => {
        ev.target.select();
      },
      id: "url2",
      onChange: this.handleOnURLChange,
    };
    return (
      <div>
        <Meta />
        <header className="dashboard--header">
          <div className="l">
            <div className="header--left">
              <a className="header--logo" href="/">
                <img src="static/full-logo-white.png" alt="RUXtest | Dexecure" />
              </a>
            </div>
            <div className="header--middle">
              <label className="switch">
                <input onClick={this.handleToggleClick} defaultChecked={this.state.checked} type="checkbox" id="togBtn" />
                <div className="slider round">
                  <span className="on">
                    Compare
                  </span>
                  <span className="off">
                    Test
                  </span>
                </div>
              </label>
            </div>
            <div className="header--right">
              <a className="btn" href="https://dexecure.com">Try Dexecure</a>
            </div>
          </div>
        </header>
        <div className="svg-background">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice" aria-hidden="true"><path fill="#efefee" d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z" /><path fill="#f6f6f6" d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z" /><path fill="#f7f7f7" d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z" /><path fill="#fbfbfc" d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z" /><path fill="#ebebec" d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z" /><path fill="#e1e1e1" d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z" /><path fill="#e7e7e7" d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z" /></svg>
        </div>
        <div className="heading">
          <h1>Real User Experience Test (rUXt) - Comparison</h1>
          <h2>Compare among 1,241,019 websites accessed by Google Chrome Users</h2>
        </div>
        <div className="container">
        <div className="DeviceConnection__wrapper">
          <div className="DeviceInput__wrapper">
            <Select
              value={this.state.device}
              onChange={this.handleOnDeviceChange}
              clearable={false}
              options={deviceList}
              searchable={false}
            />
          </div>
          <div className="ConnectionInput__wrapper">
            <Select
              value={this.state.connection}
              onChange={this.handleOnConnectionChange}
              clearable={false}
              searchable={false}
              options={connectionList}
            />
          </div>
        </div>
        <div className="TimeInput__wrapper">
          <span className="TimeInput__label">Time (in seconds):</span>
          <Slider
            min={0}
            max={10}
            value={Number(this.state.time)}
            format={formatsecond}
            tooltip={false}
            handleLabel={this.state.time.toString()}
            onChange={this.handleOnTimeChange}
          />
        </div>
        <div className="visual__wrapper">
          <div className="loader">
            <PulseLoader
              color="#db3340"
              loading={this.state.loading}
              size={30}
            />
          </div>
        </div>
          <div className="URLCompare__wrapper">
            <div className="URLInput__wrapper">
              <Autosuggest
                suggestions={this.state.urlSuggestions}
                onSuggestionsFetchRequested={this.onUrlSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                getSuggestionValue={this.getUrlSuggestionValue}
                renderSuggestion={this.renderUrl1Suggestion}
                inputProps={inputProps1}
              />
              <div className="result__wrapper">
                <Visual
                  fcpHumanCount={this.state.fcpHumanCount1}
                  onloadHumanCount={this.state.onloadHumanCount1}
                  loadingHumanCount={this.state.loadingHumanCount1}
                />
                <div className="table__wrapper">
                  <div className="seb__wrapper">
                    <span className="table__header" title="Site Experience Benchmark (SEB) score: the fraction of users completing first contentful paint within first second.">
                    SEB score
                    </span>
                    <span className="table__content">
                      {((this.state.fcp1 === null) || (this.state.time === 0) || this.state.fcp1[this.state.time] === null) ? "-"
                          : this.state.fcp1["1"].toFixed(3)}
                    </span>
                  </div>
                  <div className="fcpProb__wrapper">
                    <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
                      Users with FCP {((this.state.fcp1 === null) || (this.state.time === 0) || this.state.fcp1[this.state.time] === null) ? ""
                        : "<" + this.state.time + "s"}
                    </span>
                    <span className="table__content">
                      {((this.state.fcp1 === null) || (this.state.time === 0) || this.state.fcp1[this.state.time] === null) ? "-"
                        : (this.state.fcp1[this.state.time] * 100).toFixed(1) + "%"}
                    </span>
                  </div>
                  <div className="onloadProb__wrapper">
                    <span className="table__header" title="The percentage of users completing document load within given time.">
                      Users with onload {((this.state.onload1 === null) || (this.state.time === 0) || this.state.onload1[this.state.time] === null) ? ""
                        : `<${this.state.time}s`}
                    </span>
                    <span className="table__content">
                      {((this.state.onload1 === null) || (this.state.time === 0) || this.state.onload1[this.state.time] === null) ? "-"
                        : (this.state.onload1[this.state.time]*100).toFixed(1)+"%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="URLInput__wrapper">
              <Autosuggest
                suggestions={this.state.urlSuggestions}
                onSuggestionsFetchRequested={this.onUrlSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                getSuggestionValue={this.getUrlSuggestionValue}
                renderSuggestion={this.renderUrl2Suggestion}
                inputProps={inputProps2}
              />
            <div className="result__wrapper">
              <Visual
                fcpHumanCount={this.state.fcpHumanCount2}
                onloadHumanCount={this.state.onloadHumanCount2}
                loadingHumanCount={this.state.loadingHumanCount2}
              />
              <div className="table__wrapper">
                <div className="seb__wrapper">
                  <span className="table__header" title="Site Experience Benchmark (SEB) score: the fraction of users completing first contentful paint within first second.">
                  SEB score
                  </span>
                  <span className="table__content">
                    {((this.state.fcp2 === null) || (this.state.time === 0) || this.state.fcp2[this.state.time] === null) ? "-"
                        : this.state.fcp2["1"].toFixed(3)}
                  </span>
                </div>
                <div className="fcpProb__wrapper">
                  <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
                    Users with FCP {((this.state.fcp2 === null) || (this.state.time === 0) || this.state.fcp2[this.state.time] === null) ? ""
                      : "<" + this.state.time + "s"}
                  </span>
                  <span className="table__content">
                    {((this.state.fcp2 === null) || (this.state.time === 0) || this.state.fcp2[this.state.time] === null) ? "-"
                      : (this.state.fcp2[this.state.time] * 100).toFixed(1) + "%"}
                  </span>
                </div>
                <div className="onloadProb__wrapper">
                  <span className="table__header" title="The percentage of users completing document load within given time.">
                    Users with onload {((this.state.onload2 === null) || (this.state.time === 0) || this.state.onload2[this.state.time] === null) ? ""
                      : `<${this.state.time}s`}
                  </span>
                  <span className="table__content">
                    {((this.state.onload2 === null) || (this.state.time === 0) || this.state.onload2[this.state.time] === null) ? "-"
                      : (this.state.onload2[this.state.time]*100).toFixed(1)+"%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="explanation__wrapper">
          <div className="explanation__row">
            <div className="explanation__item">
              <div className="explanation__header">
                <span className="explanation__text">
                  How to use the tool
                </span>
              </div>
              <div className="explanation__section">
                <span className="explanation__text">
                  - Select a website using the autocomplete.<br />
                  - (Optional) select a device and connection type. <br />
                  - Use the time slider to select the user wait time.
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
                  - <Human color="#ffffff" /> : no content loaded,<br />
                  - <Human color="#5486AA" /> : some content loaded,<br />
                  - <Human color="#153B58" /> : document loaded.
                </span>
              </div>
            </div>
          </div>
          <div className="explanation__header">
            <span className="explanation__text">
              Metrics
            </span>
          </div>
          <div className="explanation__section">
            <span className="explanation__text">
              - <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/#diving-into-the-important-questions-wheee">Site Experience Benchmark (SEB)</a> score: the fraction of users completing first contentful paint within first second.<br />
              - The percentage of users completing <a href="https://developers.google.com/web/updates/2017/06/user-centric-performance-metrics#first_paint_and_first_contentful_paint">first contentful paint</a> within given time.<br />
              - The percentage of users completing document load within given time.<br />
            </span>
          </div>
          <div className="explanation__header">
            <span className="explanation__text">
              Learn more
            </span>
          </div>
          <div className="explanation__section">
            <span className="explanation__text">
              - Read more on CrUX and the metrics for user experience in <a href="https://dexecure.com/blog/chrome-user-experience-report-explained-google-bigquery/">the introductory article on CrUX</a>.<br />
              - Contribute at <a href="https://github.com/dexecure/ruxt">GitHub</a>. Suggestions welcome.<br />
              - Reach out at <a href="mailto:coffee@dexecure.com">coffee@dexecure.com</a>.
            </span>
          </div>
        </div>
      </div>
        <style jsx>{`
          .URLCompare__wrapper {
            border: 1px solid #ccc;
            overflow: auto;
          }
          .result__wrapper {
            margin-top: 3%;
            max-height: 60%;
          }
          .URLInput__wrapper {
            display: inline-block;
            width: 47%;
          }
          .URLInput__wrapper:first-child {
            float: left;
            padding-right: 15px;
            border-right: 1px solid #ccc;
          }
          @media all and (max-width: 1049px) {
            .URLInput__wrapper {
              width: 46%;
            }
          }
          @media all and (max-width: 800px) {
            .URLInput__wrapper {
              width: 45%;
            }
          }
          @media all and (max-width: 650px) {
            .URLInput__wrapper {
              padding-left: 6px;
            }
            .URLInput__wrapper:first-child {
              float: none;
              padding-right: 0;
              border-right: none;
            }
          }
          .table__header {
              font-size: 13px;
          }
          .table__content {
              font-size: 30px;
          }
          @media all and (max-width: 890px) {
            .table__header {
              font-size: 9px;
            }
            .table__content {
              font-size: 22px;
            }
          }
          @media all and (max-width: 650px) {
            .URLInput__wrapper {
              display: block;
              width: 92%;
            }
            .table__header {
              font-size: 1.2em;
            }
            .table__content {
              font-size: 3em;
            }
          }
        `}
        </style>
      </div>
    );
  }
}

export default CompareComponent;
