import React from "react";
import fetch from "isomorphic-fetch";
import { Async } from "react-select";

class URLInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleGetOrigins = this.handleGetOrigins.bind(this);
  }

  handleOnChange(value) {
    this.setState({
      url: value,
    });
    console.log(this.state.url);
  }

  handleGetOrigins(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`http://54.234.121.156/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: input,
      }),
    })
      .then(response => response.json())
      .then((json) => {
        console.log(json);
        return { options: json };
      });
  }
  render() {
    return (
      <div className="section">
        <Async
          value={this.state.url}
          onChange={this.handleOnChange}
          valueKey="origin"
          labelKey="origin"
          loadOptions={this.handleGetOrigins}
        />
      </div>
    );
  }
}

export default URLInput;
