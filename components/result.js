import React from "react";
import qs from "qs";
import Router from "next/router";
import Meta from "./meta";
import Autosuggest from "react-autosuggest";
import Select from "react-select";
import Slider from "react-rangeslider";
import { debounce } from "underscore";
import { PulseLoader } from "react-spinners";
import Visual from "../components/visual";
import Explanation from "./explanation";

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
      device: devAndconDefault,
      connection: devAndconDefault,
      time: 1,
      fcp: null,
      onload: null,
      fcpHumanCount: 0,
      loadingHumanCount: humanCount,
      onloadHumanCount: 0,
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
    const { device, connection, url  } = Router.query;
    if (url === undefined && device === undefined && connection === undefined) {
      const basicURL = window.location.pathname;
      Router.push(basicURL, basicURL, { shallow: true });
    } else {
      const newURL = window.location.pathname + "?" +
      qs.stringify({ url: url ? url : defaultUrl, device: device ? device : devAndconDefault,
        connection: connection ? connection : devAndconDefault }, { encode: false });
      Router.push(newURL, newURL, { shallow: true });
      this.setState({
        url,
        device,
        connection,
      });
      this.handleUpdateNumbers(
        url,
        device,
        connection,
      );
    }
  }

  handleOnURLChange(event, { newValue }) {
    const originUrl = { newValue };
    this.setState({
      url: originUrl.newValue,
    });

    // update the url
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url: originUrl.newValue, device: device ? device : devAndconDefault,
        connection: connection ? connection : devAndconDefault }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnDeviceChange(selectedOption) {
    this.setState({
      device: selectedOption.value,
    });
    if ((this.state.url) || (!(this.state.url = defaultUrl))) {
      this.handleUpdateNumbers(
        this.state.url,
        selectedOption.value,
        this.state.connection,
      );
    }
    const { device, connection, url, time } = Router.query;
    const newURL = window.location.pathname + "?" +
      qs.stringify({ url, device: selectedOption.value, connection }, { encode: false });
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnConnectionChange(selectedOption) {
    this.setState({
      connection: selectedOption.value,
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
      this.setState({
        fcp: responseJSON.bam.fcp,
        onload: responseJSON.bam.onload,
        loading: false,
      });
      this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
    } else {
      // probably origin doesn't exist
      this.setState({
        onloadHumanCount: 0,
        fcpHumanCount: 0,
        loadingHumanCount: humanCount,
        loading: false,
      });
    }
  }

  handleUpdateHumanCount(fcp, onload, time) {
    if (time === 0) {
      this.setState({
        onloadHumanCount: 0,
        fcpHumanCount: 0,
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

    this.setState({
      onloadHumanCount,
      fcpHumanCount,
      loadingHumanCount,
    });
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
    const value = this.state.url;
    const inputProps = {
      placeholder: urlPlaceholder,
      value,
      onFocus: (ev) => {
        ev.target.select();
      },
      onChange: this.handleOnURLChange,
    };

    return (
      <div>
        <Meta />
        <div className="container">
          <div className="heading">
            <h1>Real User Experience Test (rUXt)</h1>
            <h2>1,241,019 websites accessed by Google Chrome Users</h2>
          </div>
          <div className="URLInput__wrapper">
            <Autosuggest
              suggestions={this.state.urlSuggestions}
              onSuggestionsFetchRequested={this.onUrlSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSuggestionSelected}
              getSuggestionValue={this.getUrlSuggestionValue}
              renderSuggestion={this.renderUrlSuggestion}
              inputProps={inputProps}
            />
          </div>
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
            <Visual
              fcpHumanCount={this.state.fcpHumanCount}
              onloadHumanCount={this.state.onloadHumanCount}
              loadingHumanCount={this.state.loadingHumanCount}
            />
          </div>
          <div className="table__wrapper">
            <div className="seb__wrapper">
              <span className="table__header" title="Site Experience Benchmark (SEB) score: the fraction of users completing first contentful paint within first second.">
              SEB score
              </span>
              <span className="table__content">
                {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? "-"
                    : this.state.fcp["1"].toFixed(3)}
              </span>
            </div>
            <div className="fcpProb__wrapper">
              <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
                Users with FCP {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? ""
                  : "<" + this.state.time + "s"}
              </span>
              <span className="table__content">
                {((this.state.fcp === null) || (this.state.time === 0) || this.state.fcp[this.state.time] === null) ? "-"
                  : (this.state.fcp[this.state.time] * 100).toFixed(1) + "%"}
              </span>
            </div>
            <div className="onloadProb__wrapper">
              <span className="table__header" title="The percentage of users completing document load within given time.">
                Users with onload {((this.state.onload === null) || (this.state.time === 0) || this.state.onload[this.state.time] === null) ? ""
                  : `<${this.state.time}s`}
              </span>
              <span className="table__content">
                {((this.state.onload === null) || (this.state.time === 0) || this.state.onload[this.state.time] === null) ? "-"
                  : (this.state.onload[this.state.time]*100).toFixed(1)+"%"}
              </span>
            </div>
          </div>
          <Explanation />
        </div>
      </div>
    );
  }
}

export default ResultComponent;
