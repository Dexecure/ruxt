import React from "react";

class CompareButton extends React.Component {
  render() {
    return (
      <div className="compare--button">
        <label className="compare--label"> Compare </label>
        <label htmlFor="togBtn" className="switch">
          <input onClick={this.props.handleClick} defaultChecked={this.props.checked} type="checkbox" id="togBtn" />
          <div className="slider round">
            <span className="on">
              On
            </span>
            <span className="off">
              Off
            </span>
          </div>
        </label>
      </div>
    );
  }
}

export default CompareButton;
