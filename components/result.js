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
import ResultScore from "./resultScore";
import { ToastContainer } from "react-toastify";
import { style, toast } from "react-toastify";
import { countryList } from "../data/countryList";
import { deviceList, connectionList } from "../data/devAndConList";

style({
  colorDefault: "#153B58",
  colorProgressDefault: "#db3340",
  width: "500px",
});

const humanCount = 1000;
const defaultUrl = "https://google.com";
const devAndconAndconuDefault = "all";

class ResultComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlSuggestions: [],
      url: defaultUrl,
      device: devAndconAndconuDefault,
      connection: devAndconAndconuDefault,
      time: 1,
      fcp: null,
      onload: null,
      fcpHumanCount: 0,
      loadingHumanCount: humanCount,
      onloadHumanCount: 0,
      loading: false,
      country: countryList[0],
    };

    this.handleOnURLChange = this.handleOnURLChange.bind(this);
    this.handleOnCountryChange = this.handleOnCountryChange.bind(this);
    this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
    this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
    this.handleGetOrigins = this.handleGetOrigins.bind(this);
    this.handleOnTimeChange = this.handleOnTimeChange.bind(this);
    this.handleUpdateNumbers = this.handleUpdateNumbers.bind(this);
    this.handleUpdateHumanCount = this.handleUpdateHumanCount.bind(this);
    this.onUrlSuggestionsFetchRequested = this.onUrlSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.debouncedLoadSuggestions = debounce(
      this.loadSuggestionsFromServer,
      500,
    );
  }

  componentDidMount() {
    const { device, connection, url, country } = Router.query;
    if (url === undefined && device === undefined && connection === undefined) {
      const basicURL = window.location.pathname;
      Router.push(basicURL, basicURL, { shallow: true });
    } else {
      const newURL = `${window.location.pathname}?${qs.stringify(
        {
          url: url || defaultUrl,
          device: device || devAndconAndconuDefault,
          connection: connection || devAndconAndconuDefault,
          country:
            country === "All countries" ? devAndconAndconuDefault : country,
        },
        { encode: false },
      )}`;
      Router.push(newURL, newURL, { shallow: true });
      this.setState({
        url,
        device,
        connection,
        country: country === "all" ? countryList[0] : country,
      });
      this.handleUpdateNumbers(url, device, connection, country);
    }
  }

  handleOnURLChange(event, { newValue }) {
    const originUrl = { newValue };
    this.setState({
      url: originUrl.newValue,
    });

    // update the url
    const { device, connection, url, time, country } = Router.query;
    const newURL = `${window.location.pathname}?${qs.stringify(
      {
        url: originUrl.newValue,
        device: device || devAndconAndconuDefault,
        connection: connection || devAndconAndconuDefault,
        country:
          country === "All countries" ? devAndconAndconuDefault : country,
      },
      { encode: false },
    )}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnDeviceChange(selectedOption) {
    this.setState({
      device: selectedOption.value,
    });
    if (this.state.url || !(this.state.url = defaultUrl)) {
      this.handleUpdateNumbers(
        this.state.url,
        selectedOption.value,
        this.state.connection,
        this.state.country =
          country === "All countries" ? devAndconAndconuDefault : this.state.country,
      );
    }
    const { device, connection, url, time, country } = Router.query;
    const newURL = `${window.location.pathname}?${qs.stringify(
      { 
        url,
        device: selectedOption.value,
        connection,
        time,
        country: country === "All countries" ? devAndconAndconuDefault : country,
      },
      { encode: false },
    )}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnConnectionChange(selectedOption) {
    this.setState({
      connection: selectedOption.value,
    });
    if (this.state.url || !(this.state.url = defaultUrl)) {
      this.handleUpdateNumbers(
        this.state.url,
        this.state.device,
        selectedOption.value,
        this.state.country =
          country === "All countries" ? devAndconAndconuDefault : this.state.country,
      );
    }
    const { device, connection, url, time, country } = Router.query;
    const newURL = `${window.location.pathname}?${qs.stringify(
      {
        url,
        device,
        connection: selectedOption.value,
        time,
        country:
          country === "All countries" ? devAndconAndconuDefault : country,
      },
      { encode: false },
    )}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnCountryChange(selectedOption) {
    this.setState({
      country: selectedOption.value,
    });
    if (this.state.url || !(this.state.url = defaultUrl)) {
      this.handleUpdateNumbers(
        this.state.url,
        this.state.device,
        this.state.connection,
        selectedOption.value,
      );
    }
    const { device, connection, url, time, country } = Router.query;
    const newURL = `${window.location.pathname}?${qs.stringify(
      {
        url,
        device,
        connection,
        time,
        country:
          selectedOption.value === "All countries" ? devAndconAndconuDefault : selectedOption.value,
      },
      { encode: false },
    )}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnTimeChange(selectedOption) {
    if (typeof selectedOption === "number") {
      this.setState({
        time: selectedOption,
      });
    }
    this.handleUpdateHumanCount(
      this.state.fcp,
      this.state.onload,
      selectedOption,
    );
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

  async handleUpdateNumbers(url, device, connection, country) {
    console.log(url, device, connection);
    if (!(url.startsWith("http://") || url.startsWith("https://"))) {
      // doesnt seem to be a valid url
      return;
    }

    if (country === "All countries") {
      country = "all";
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
        country,
      }),
    });
    if (response.ok) {
      const responseJSON = await response.json();
      this.setState({
        fcp: responseJSON.bam.fcp,
        onload: responseJSON.bam.onload,
        loading: false,
      });
      this.handleUpdateHumanCount(
        responseJSON.bam.fcp,
        responseJSON.bam.onload,
        this.state.time,
      );
      if (responseJSON.bam.fcp === null) {
        toast("We don't have data for that particular website", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } else {
      // probably origin doesn't exist
      this.setState({
        onloadHumanCount: 0,
        fcpHumanCount: 0,
        loadingHumanCount: humanCount,
        loading: false,
      });
      toast("We don't have data for that particular website", {
        position: toast.POSITION.BOTTOM_LEFT,
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
      onloadHumanCount = Math.max(0, Math.floor(onload_prob * humanCount));
    }

    if (fcp) {
      fcp_prob = fcp[time];
      fcpHumanCount = Math.max(
        0,
        Math.floor((fcp_prob - onload_prob) * humanCount),
      );
    }

    const loadingHumanCount = Math.max(
      0,
      Math.floor(humanCount - fcp_prob * humanCount),
    );

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
      this.state.country,
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
    return <span>{url.origin}</span>;
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
    const countries = countryList.map(country => ({
      value: country,
      label: country,
    }));

    return (
      <div>
        <Meta />
        <ToastContainer closeButton={false} />
        <div className="heading">
          <h1>Real User Experience Test (rUXt)</h1>
          <h2>3,237,526 websites accessed by Google Chrome Users</h2>
        </div>
        <div className="container">
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
                value={this.state.country}
                onChange={this.handleOnCountryChange}
                clearable={false}
                options={countries}
                searchable
              />
            </div>
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
          <ResultScore
            fcp={this.state.fcp}
            time={this.state.time}
            onload={this.state.onload}
          />
          <Explanation />
        </div>
      </div>
    );
  }
}

export default ResultComponent;
