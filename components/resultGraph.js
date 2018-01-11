import React from "react";
import Router from "next/router";
import qs from "qs";
import { debounce } from "underscore";
import Autosuggest from "react-autosuggest";
import { PulseLoader } from "react-spinners";
import Visual from "../components/visual";

const humanCount = 1000;
const defaultUrl = "https://google.com";

class ResultGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: defaultUrl,
      urlSuggestions: [],
      fcp: null,
      onload: null,
      fcpHumanCount: 0,
      loadingHumanCount: humanCount,
      onloadHumanCount: 0,
      loading: false,
    };

    this.handleOnURLChange = this.handleOnURLChange.bind(this);
    this.handleGetOrigins = this.handleGetOrigins.bind(this);
    this.handleUpdateHumanCount = this.handleUpdateHumanCount.bind(this);
    this.handleUpdateNumbers = this.handleUpdateNumbers.bind(this);
    this.onUrlSuggestionsFetchRequested = this.onUrlSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.debouncedLoadSuggestions = debounce(this.loadSuggestionsFromServer, 500);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url || this.props.device !== nextProps.device ||
        this.props.connection !== nextProps.connection) {
      this.handleUpdateNumbers(nextProps.url, nextProps.device, nextProps.connection);
    }
    if (this.props.time !== nextProps.time) {
      this.handleUpdateHumanCount(this.state.fcp, this.state.onload, nextProps.time);
    }
  }

  renderUrlSuggestion(url) {
    return (
      <span>{url.origin}</span>
    );
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
    let onloadProb = 0;
    let fcpProb = 0;

    if (onload) {
      onloadProb = onload[time];
      onloadHumanCount = Math.max(0, Math.floor(onloadProb * humanCount));
    }

    if (fcp) {
      fcpProb = fcp[time];
      fcpHumanCount = Math.max(0, Math.floor((fcpProb - onloadProb) * humanCount));
    }

    const loadingHumanCount = Math.max(0, Math.floor(humanCount - fcpProb * humanCount));

    this.setState({
      onloadHumanCount,
      fcpHumanCount,
      loadingHumanCount,
    });
  }

  async handleUpdateNumbers(url, device, connection) {
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
      this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.props.time);
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

  async loadSuggestionsFromServer(value) {
    const urls = await this.handleGetOrigins(value);
    this.setState({
      urlSuggestions: urls.options,
    });
  }

  getUrlSuggestionValue(url) {
    return url.origin;
  }

  onUrlSuggestionsFetchRequested({ value }) {
    this.debouncedLoadSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      urlSuggestions: [],
    });
  }

  async onSuggestionSelected(event, { suggestion }) {
    this.handleUpdateNumbers(
      suggestion.origin,
      this.props.device,
      this.props.connection,
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

  handleOnURLChange(event, { newValue }) {
    const originUrl = { newValue };
    this.setState({
      url: originUrl.newValue,
    });

    // update the url
    const { query } = Router;
    query[`url${this.props.id}`] = originUrl.newValue;
    const newURL = `${window.location.pathname}?${qs.stringify(query, { encode: false })}`;
    Router.push(newURL, newURL, { shallow: true });
  }


  render() {
    const inputProps = {
      placeholder: defaultUrl,
      value: this.props.url || this.state.url,
      onFocus: (ev) => {
        ev.target.select();
      },
      id: this.props.id,
      onChange: this.handleOnURLChange,
    };
    return (
      <div className="URLInput__wrapper">
        <Autosuggest
          id={this.props.id}
          suggestions={this.state.urlSuggestions}
          onSuggestionsFetchRequested={this.onUrlSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getUrlSuggestionValue}
          renderSuggestion={this.renderUrlSuggestion}
          inputProps={inputProps}
        />
        <div className="result__wrapper">
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
                {((this.state.fcp === null) || this.state.fcp["1"] === null || (this.props.time === 0) ||
                  this.state.fcp[this.state.time] === null) ? "-"
                    : this.state.fcp["1"].toFixed(3)}
              </span>
            </div>
            <div className="fcpProb__wrapper">
              <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
                Users with FCP {((this.state.fcp === null) || (this.props.time === 0) || this.state.fcp[this.props.time] === null) ? ""
                  : `<${window.location.pathname}s`}
              </span>
              <span className="table__content">
                {((this.state.fcp === null) || (this.props.time === 0) || this.state.fcp[this.props.time] === null) ? "-"
                  : `${(this.state.fcp[this.props.time] * 100).toFixed(1)}%`}
              </span>
            </div>
            <div className="onloadProb__wrapper">
              <span className="table__header" title="The percentage of users completing document load within given time.">
                Users with onload {((this.state.onload === null) || (this.props.time === 0) || this.state.onload[this.props.time] === null) ? ""
                  : `<${this.props.time}s`}
              </span>
              <span className="table__content">
                {((this.state.onload === null) || (this.props.time === 0) || this.state.onload[this.props.time] === null) ? "-"
                  : `${(this.state.onload[this.props.time] * 100).toFixed(1)}%`}
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
              font-size: 12px;
          }
          .table__content {
              font-size: 30px;
          }
          @media all and (max-width: 965px) {
            .table__header {
              font-size: 10px;
            }
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

export default ResultGraph;
