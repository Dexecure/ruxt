import React from "react";
import qs from "qs";
import Router from "next/router";
import Select from "react-select";
import Slider from "react-rangeslider";
import Meta from "../components/meta";
import Explanation from "../components/explanation";
import ResultGraph from "../components/resultGraph";
import Header from "../components/header";
import CompareButton from "../components/compareButton";
import { countryList } from "../data/countryList";
import { deviceList, connectionList } from "../data/devAndConList";

const devAndconAndDefault = "all";

class CompareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url1: null,
      url2: null,
      device: devAndconAndDefault,
      connection: devAndconAndDefault,
      country: countryList[0],
      time: 1,
      checked: true,
    };
    this.handleOnCountryChange = this.handleOnCountryChange.bind(this);
    this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
    this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
    this.handleOnTimeChange = this.handleOnTimeChange.bind(this);
  }

  componentDidMount() {
    const { query } = Router;

    const device = query.device || this.state.device;
    device ? this.setState({ device }) : null;

    const connection = query.connection || this.state.connection;
    connection ? this.setState({ connection }) : null;

    const country = query.country || this.state.country;
    country ? this.setState({ country }) : null;

    const time = query.time || this.state.time;
    time ? this.setState({ time }) : null;

    const url1 = query.url1 || query.url;
    url1 ? this.setState({ url1 }) : null;

    const url2 = query.url2;
    url2 ? this.setState({ url2 }) : null;
  }

  handleOnDeviceChange(selectedOption) {
    this.setState({
      device: selectedOption.value,
    });

    // update the url
    const { query } = Router;
    query.device = selectedOption.value;
    const newURL = `${window.location.pathname}?${qs.stringify(query, {
      encode: false,
    })}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnCountryChange(selectedOption) {
    this.setState({
      country: selectedOption.value,
    });

    // update the url
    const { query } = Router;
    query.country =
      selectedOption.value === "All countries" ? "all" : selectedOption.value;
    const newURL = `${window.location.pathname}?${qs.stringify(query, {
      encode: false,
    })}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnConnectionChange(selectedOption) {
    this.setState({
      connection: selectedOption.value,
    });

    // update the url
    const { query } = Router;
    query.connection = selectedOption.value;
    const newURL = `${window.location.pathname}?${qs.stringify(query, {
      encode: false,
    })}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleOnTimeChange(selectedOption) {
    if (typeof selectedOption === "number") {
      this.setState({
        time: selectedOption,
      });
    }

    // update the url
    const { query } = Router;
    query.time = selectedOption;
    const newURL = `${window.location.pathname}?${qs.stringify(query, {
      encode: false,
    })}`;
    Router.push(newURL, newURL, { shallow: true });
  }

  handleToggleClick() {
    Router.push("/");
  }

  render() {
    const formatsecond = value => `${value} s`;
    const countries = countryList.map(country => ({
      value: country,
      label: country,
    }));
    return (
      <div>
        <Meta />
        <Header />
        <CompareButton
          handleClick={this.handleToggleClick}
          checked={this.state.checked}
        />
        <div className="svg-background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 810"
            preserveAspectRatio="xMinYMin slice"
            aria-hidden="true"
          >
            <path
              fill="#efefee"
              d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"
            />
            <path
              fill="#f6f6f6"
              d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"
            />
            <path
              fill="#f7f7f7"
              d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"
            />
            <path
              fill="#fbfbfc"
              d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"
            />
            <path
              fill="#ebebec"
              d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"
            />
            <path
              fill="#e1e1e1"
              d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"
            />
            <path
              fill="#e7e7e7"
              d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"
            />
          </svg>
        </div>
        <div className="heading">
          <h1>Real User Experience Test (rUXt) - Comparison</h1>
          <h2>
            Compare among 3,237,526 websites accessed by Google Chrome Users
          </h2>
        </div>
        <div className="container">
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
          <div className="URLCompare__wrapper">
            <ResultGraph
              id="1"
              url={this.state.url1}
              device={this.state.device}
              connection={this.state.connection}
              time={this.state.time}
            />
            <ResultGraph
              id="2"
              url={this.state.url2}
              device={this.state.device}
              connection={this.state.connection}
              time={this.state.time}
            />
          </div>
          <Explanation />
        </div>
        <style jsx>
          {`
            .URLCompare__wrapper {
              border: 1px solid #ccc;
              overflow: auto;
            }
          `}
        </style>
      </div>
    );
  }
}

export default CompareComponent;
