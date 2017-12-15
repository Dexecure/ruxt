import React from "react";

class Table extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("TEST");
        return (
            <div className="table__wrapper">
                {/* <div className="seb__wrapper">
                    <span className="table__header">
                        SEB score
                        </span> */}
                    {/* <span className="table__content">
                        {this.props.fcp === null ? 0 : this.props.fcp["1"]}
                    </span>
                </div>
                <div className="fcpProb__wrapper">
                    <span className="table__header">
                        FCP Probability
                        </span>
                    <span className="table__content">
                        {this.props.fcp === null ? 0 : this.props.fcp[this.props.time]}
                    </span>
                </div>
                <div className="onloadProb__wrapper">
                    <span className="table__header">
                        Onload Probability
                        </span>
                    <span className="table__content">
                        {this.props.onload ? 0 : this.props.onload[this.props.time]}
                    </span>
                </div> */}
            </div>
        );
    }
}

export default Table;