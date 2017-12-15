import React from "react";
import Select from 'react-select'; 
import { Async } from 'react-select';
import Visual from '../components/visual';

class ResultComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: {"origin": ""},
            device: {label: "All device types", value: "all"},
            connection: { label: "All connection types", value: "all" },
            time: "1"
        }
        console.log(this.state.device);
        this.handleOnURLChange = this.handleOnURLChange.bind(this);
        this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
        this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
        this.handleGetOrigins = this.handleGetOrigins.bind(this);
    }
    // When an URL from the dropdown is selected
    handleOnURLChange(selectedOption) {
        this.setState({
            url: selectedOption,
        });
    }
    handleOnDeviceChange(selectedOption) {
        this.setState({
            device: selectedOption,
        });
    }
    handleOnConnectionChange(selectedOption) {
        this.setState({
            connection: selectedOption,
        });
    }
    // To get the list of origin given a term input
    handleGetOrigins(input) {
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        return fetch(`http://54.234.121.156/search`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'origin': input
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                return { options: json };
            });
    }
    render() {
        var deviceList = [
            { value: "all", label: "All device types" },
            { value: "phone", label: "Phone" },
            { value: "tablet", label: "Tablet" },
            { value: "desktop", label: "Desktop" }
        ];
        var connectionList = [
            { value: "all", label: "All connection types" },
            { value: "4G", label: "4G" },
            { value: "3G", label: "3G" },
            { value: "2G", label: "2G" },
            { value: "slow-2G", label: "slow-2G" },
            { value: "offline", label: "offline" }
        ];
        return (
            <div className="container">
                <div className="URLInput__wrapper">
                    <Async
                        value={this.state.url}
                        onChange={this.handleOnURLChange}
                        valueKey="origin"
                        labelKey="origin"
                        loadOptions={this.handleGetOrigins}
                    />
                </div>
                <div className="DeviceConnection__wrapper">
                    <div className="DeviceInput__wrapper">
                        <Select
                            value={this.state.device.value}
                            onChange={this.handleOnDeviceChange}
                            options={deviceList}
                        />
                    </div>
                    <div className="ConnectionInput__wrapper">
                        <Select
                            value={this.state.connection.value}
                            onChange={this.handleOnConnectionChange}
                            options={connectionList}
                        />
                    </div>
                </div>
                <div visual__wrapper>
                    URL: {this.state.url.origin} <br></br>
                    device: {this.state.device.value} <br></br>
                    connection: {this.state.connection.value} <br></br>
                    <Visual url={this.state.url} device={this.state.device} connection={this.state.connection} />
                </div>
                <style jsx>{`
                    
                `}
                </style>
            </div>
        );
    }
}

export default ResultComponent;