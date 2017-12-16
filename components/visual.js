import React from "react";
import Human from "../components/human";

class Visual extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {Array.apply(null, Array(this.props.onloadHumanCount)).map(function (item, i) {
                    return (
                        <Human key={`onload-${i}`} color="#153B58" />
                    );
                }, this)}
                {Array.apply(null, Array(this.props.fcpHumanCount)).map(function (item, i) {
                    return (
                        <Human key={`fcp-${i}`} color="#5486AA" />
                    );
                }, this)}
                {Array.apply(null, Array(this.props.loadingHumanCount)).map(function (item, i) {
                    return (
                        <Human key={`loading-${i}`} color="#ffffff" />
                    );
                }, this)}
            </div>
        );
    }
}

export default Visual;