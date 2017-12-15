import React from "react";
import Select from 'react-select'; 
import { Async } from 'react-select';
import Slider from 'react-rangeslider'
import Visual from '../components/visual';

const humanCount = 1000;

class ResultComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: { "origin": 'Enter website URL' },
            device: {label: "All device types", value: "all"},
            connection: { label: "All connection types", value: "all" },
            time: "1",
            fcp: null,
            onload: null,
            fcpHumanCount: 0,
            onloadHumanCount: 0,
            loadingHumanCount: humanCount,
            loading: false
        }
        this.handleOnURLChange = this.handleOnURLChange.bind(this);
        this.handleOnDeviceChange = this.handleOnDeviceChange.bind(this);
        this.handleOnConnectionChange = this.handleOnConnectionChange.bind(this);
        this.handleGetOrigins = this.handleGetOrigins.bind(this);
        this.handleOnTimeChange = this.handleOnTimeChange.bind(this);
        this.handleUpdateNumbers = this.handleUpdateNumbers.bind(this);
        this.handleUpdateHumanCount = this.handleUpdateHumanCount.bind(this);
    }
    // When an URL from the dropdown is selected
    handleOnURLChange(selectedOption) {
        this.setState({
            url: selectedOption,
        });
        if (!(selectedOption)) {
            return;
        }
        this.handleUpdateNumbers(
            selectedOption,
            this.state.device,
            this.state.connection
        );
    }
    handleOnDeviceChange(selectedOption) {
        this.setState({
            device: selectedOption,
        });
        if (!(this.state.url.origin) || (this.state.url.origin = "Enter website URL")) {
            return;
        }
        this.handleUpdateNumbers(
            this.state.url,
            selectedOption,
            this.state.connection
        );
    }
    handleOnConnectionChange(selectedOption) {
        this.setState({
            connection: selectedOption,
        });
        if (!(this.state.url.origin) || (this.state.url.origin = "Enter website URL")) {
            return;
        }
        this.handleUpdateNumbers(
            this.state.url,
            this.state.device,
            selectedOption
        );
    }
    handleOnTimeChange(selectedOption) {
        this.setState({
            time: selectedOption,
        });
        this.handleUpdateHumanCount(this.state.fcp, this.state.onload, selectedOption);
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
    async handleUpdateNumbers(url, device, connection) {
        this.setState({
            loading: true,
        });
        console.log("loading!");
        response = await fetch(`http://54.234.121.156/content`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'origin': url,
                'device': device,
                'connection': connection
            }),
        });
        console.log("finished fetching");
        // var responseJSON = {
        //     "bam": {
        //         "fcp": {
        //             "1": 0.47369999999999995,
        //             "2": 0.7875,
        //             "3": 0.8946,
        //             "4": 0.9372,
        //             "5": 0.9563999999999999,
        //             "6": 0.9672,
        //             "7": 0.9742,
        //             "8": 0.9797,
        //             "9": 0.9832000000000001,
        //             "10": 0.9858
        //         },
        //         "onload": {
        //             "1": 0.0625874825034993,
        //             "2": 0.27844431113777246,
        //             "3": 0.48040391921615677,
        //             "4": 0.626874625074985,
        //             "5": 0.7245550889822036,
        //             "6": 0.7895420915816838,
        //             "7": 0.8348330333933213,
        //             "8": 0.8674265146970606,
        //             "9": 0.8918216356728655,
        //             "10": 0.9111177764447111
        //         }
        //     }
        // };
        responseJSON = await response.json();
        this.setState({
            fcp: responseJSON.bam.fcp,
            onload: responseJSON.bam.onload,
            loading: false,
        });
        this.handleUpdateHumanCount(responseJSON.bam.fcp, responseJSON.bam.onload, this.state.time);
    }
    handleUpdateHumanCount(fcp, onload, time) {
        if (time=="0") {
            this.setState({
                onloadHumanCount: 0,
                fcpHumanCount: 0,
                loadingHumanCount: humanCount,
            });
            return;
        }
        var fcp_prob = fcp[time];
        var onload_prob = onload[time];
        var onloadHumanCount = Math.floor(onload_prob*humanCount);
        var fcpHumanCount = Math.floor((fcp_prob-onload_prob)*humanCount);
        var loadingHumanCount = Math.floor(humanCount - fcp_prob*humanCount);
        this.setState({
            onloadHumanCount: onloadHumanCount,
            fcpHumanCount: fcpHumanCount,
            loadingHumanCount: loadingHumanCount,
        })
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
        const formatsecond = value => value + ' s';
        return (
            <div className="container">
                <div className="URLInput__wrapper">
                    <Async
                        placeholder="Enter website URL"
                        value={this.state.url}
                        onChange={this.handleOnURLChange}
                        valueKey="origin"
                        labelKey="origin"
                        clearable={false}
                        backspaceRemoves={true}
                        loadOptions={this.handleGetOrigins}
                    />
                </div>
                <div className="DeviceConnection__wrapper">
                    <div className="DeviceInput__wrapper">
                        <Select
                            value={this.state.device.value}
                            onChange={this.handleOnDeviceChange}
                            clearable={false}
                            options={deviceList}
                            searchable={false}
                        />
                    </div>
                    <div className="ConnectionInput__wrapper">
                        <Select
                            value={this.state.connection.value}
                            onChange={this.handleOnConnectionChange}
                            clearable={false}
                            searchable={false}
                            options={connectionList}
                        />
                    </div>
                </div>
                <div className="TimeInput__wrapper">
                    <Slider
                        min={0}
                        max={10}
                        value={this.state.time}
                        format={formatsecond}
                        handleLabel={this.state.time}
                        onChange={this.handleOnTimeChange}
                    />
                </div>
                <div className="visual__wrapper">
                    <Visual
                        fcpHumanCount={this.state.fcpHumanCount}
                        onloadHumanCount={this.state.onloadHumanCount}
                        loadingHumanCount={this.state.loadingHumanCount}
                    />
                </div>
                <div className="table__wrapper">
                    <div className="seb__wrapper">
                        <span className="table__header">
                        SEB score
                        </span>
                        <span className="table__content">
                            {this.state.fcp === null ? 0 
                                : this.state.fcp["1"].toFixed(4)}
                        </span>
                    </div>
                    <div className="fcpProb__wrapper">
                        <span className="table__header">
                            FCP Probability
                        </span>
                        <span className="table__content">
                            {((this.state.fcp === null) || (this.state.time == "0") || this.state.fcp[this.state.time] === null) ? 0 
                                : this.state.fcp[this.state.time].toFixed(4)}
                        </span>
                    </div>
                    <div className="onloadProb__wrapper">
                        <span className="table__header">
                            Onload Probability
                        </span>
                        <span className="table__content">
                            {((this.state.onload === null) || (this.state.time == "0") || this.state.fcp[this.state.time] === null) ? 0
                                : this.state.onload[this.state.time].toFixed(4)}
                        </span>
                    </div>
                </div>
                <style jsx>{`
                    .URLInput__wrapper, .DeviceInput__wrapper,
                    .ConnectionInput__wrapper, .TimeInput__wrapper,
                    .visual__wrapper, .time__wrapper {
                        margin: 1em .5em;
                    }
                    .URLInput__wrapper .Select {
                        cursor: text;
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
                        padding: .3em;
                    }
                    .table__header {
                        color: #153B58;
                        font-size: 1.2em;
                    }
                    .table__content {
                        font-size: 3em;
                        color: #db3340;
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
                    }
                `}
                </style>
            </div>
        );
    }
}

export default ResultComponent;