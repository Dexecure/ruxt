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

class ResultComponent extends React.Component {
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
      loadingHumanCount: humanCount,
      fcp1: null,
      onload1: null,
      fcpHumanCount1: 0,
      onloadHumanCount1: 0,
      fcp2: null,
      onload2: null,
      fcpHumanCount2: 0,
      onloadHumanCount2: 0,
      loading: false,
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
    Router.push(newURL, newURL, { shallow: true });
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
    // if ((this.state.url) || (!(this.state.url = defaultUrl))) {
      
    // }
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
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
        selectedOption.value,
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
        time: selectedOption,
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
        origin: input,
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
      if(this.state.url === this.state.url1) {
        this.setState({
          fcp1: responseJSON.bam.fcp,
          onload1: responseJSON.bam.onload,
          loading: false,
        });
        this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
      } else if(this.state.url === this.state.url2){
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
    console.log(fcp);
    console.log(onload);
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

    if(this.state.url === this.state.url1) {
      this.setState({
        onloadHumanCount1: onloadHumanCount,
        fcpHumanCount1: fcpHumanCount,
        loadingHumanCount1: loadingHumanCount,
      });
    } else if(this.state.url === this.state.url2){
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

  renderUrlSuggestion(url) {
    return (
      <span>{url.origin}</span>
    );
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
                renderSuggestion={this.renderUrlSuggestion}
                inputProps={inputProps1}
              />
              <div className="result__wrapper">
                <Visual
                  fcpHumanCount={this.state.fcpHumanCount1}
                  onloadHumanCount={this.state.onloadHumanCount1}
                  loadingHumanCount={this.state.loadingHumanCount}
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
                renderSuggestion={this.renderUrlSuggestion}
                inputProps={inputProps2}
              />
            <div className="result__wrapper">
              <Visual
                fcpHumanCount={this.state.fcpHumanCount2}
                onloadHumanCount={this.state.onloadHumanCount2}
                loadingHumanCount={this.state.loadingHumanCount}
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
          .URLInput__wrapper, .DeviceInput__wrapper,
          .ConnectionInput__wrapper, .TimeInput__wrapper,
          .visual__wrapper, .time__wrapper, .explanation__wrapper {
              margin: 1em .5em;
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
          @media all and (max-width: 650px) {
            .URLInput__wrapper {
              display: block;
              width: 92%;
            }
          }
          .table__wrapper {
              display: flex;
              justify-content: space-around;
              align-items: flex-start;
          }
          .seb__wrapper, .fcpProb__wrapper, .onloadProb__wrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 1em .3em;
          }
          .table__header {
              color: #153B58;
              font-size: 13px;
          }
          .table__content {
              font-size: 30px;
              color: #db3340;
          }
          @media all and (max-width: 890px) {
            .table__header {
              font-size: 9px;
            }
            .table__content {
              font-size: 22px;
            }
          }
          .explanation__header {
              color: #153B58;
              font-size: 1.2em;
              padding: 1em 0 .5em 0;
          }
          @media all and (max-width: 40em) {
              .table__wrapper {
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
              }
          }
          @media all and (min-width: 50em) {
              .DeviceConnection__wrapper {
                  display: flex;
              }
              .DeviceInput__wrapper, .ConnectionInput__wrapper {
                  width: 50%;
              }
              .explanation__row {
                display: block;
                flex-direction: row;
                align-items: flex-start;
              }
              .explanation__item {
                padding-right: 2em;
              }
          }
          .visual__wrapper {
            position: relative;
          }
          .loader {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .explanation__section {
            padding: .3em 0;
          }
          .TimeInput__wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .TimeInput__label {
            max-width: 150px;
            width:100%;
            margin-right: 5px;
          }
        `}
        </style>
      </div>
    );
  }
}

export default ResultComponent;
