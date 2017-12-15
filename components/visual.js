import React from "react";

class Visual extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                URL: { this.props.url.origin } <br></br>
                device: { this.props.device.value } <br></br>
                connection: {this.props.connection.value} <br></br>
            </div>
        );
    }
}

export default Visual;