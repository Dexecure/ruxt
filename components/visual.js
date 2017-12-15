import React from "react";

class Visual extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.url,
            device: this.props.device,
            connection: this.props.connection,
            time: this.props.time
        };
    }

    render() {
        return (
            <div>
                URL: { this.state.url.origin } <br></br>
                device: { this.state.device.value } <br></br>
                connection: {this.state.connection.value} <br></br>
            </div>
        );
    }
}

export default Visual;