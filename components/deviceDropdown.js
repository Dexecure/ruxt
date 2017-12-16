import React from "react";
import Async from "react-select";

class DeviceDropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      device: "all",
      submitting: false,
    };
    this.handleonDeviceChange = this.handleonDeviceChange.bind(this);
    this.handleGetDevice = this.handleGetDevice.bind(this);
  }

  handleonDeviceChange(value) {
    this.setState({
      device: value,
    });
  }

  async handleGetDevice(ev) {
    console.log(this.state.value);
    ev.preventDefault();
    this.setState({
      submitting: true,
    });
    if (!ev) {
      return { options: [] };
    }
    const response = await fetch(`${process.env.BACKEND_URL}/search`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: this.state.URLvalue,
      }),
    });

    const responseJSON = await response.json();
    console.log(responseJSON);
  }

  render() {

    return (
      <div className="urlInput">
        <Async
          value={this.state.URLvalue}
          onChange={this.handleonURLChange}
          valueKey="id"
          labelKey="login"
          loadOptions={this.handleGetUsers}
          backspaceRemoves={true}
        />
        <style jsx>{`
            
        `}
        </style>
      </div>
    );
  }
}

export default DeviceDropdownComponent;
