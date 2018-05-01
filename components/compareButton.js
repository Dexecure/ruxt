import React from "react";

class CompareButton extends React.Component {
  render() {
    return (
      <div className="compare--button">
        <label className="compare--label"> Compare </label>
        <label htmlFor="togBtn" className="switch">
          <input
            onClick={this.props.handleClick}
            defaultChecked={this.props.checked}
            type="checkbox"
            id="togBtn"
          />
          <div className="slider round">
            <span className="on">On</span>
            <span className="off">Off</span>
          </div>
        </label>
        <style jsx>{`
          .switch {
            position: absolute;
            display: block;
            right: 7%;
            width: 70px;
            height: 34px;
            margin-top: 20px;
          }
          .switch input {
            display: none;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #b2a22d;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }
          input:checked + .slider:before {
            left: 1px;
          }
          input:checked + .slider {
            background-color: #8bc34a;
          }
          input:focus + .slider {
            box-shadow: 0 0 1px #2196f3;
          }
          input:checked + .slider:before {
            -webkit-transform: translateX(40px);
            -ms-transform: translateX(40px);
            transform: translateX(40px);
          }
          .on,
          .off {
            color: white;
            position: absolute;
            transform: translate(-50%, -50%);
            top: 50%;
            left: 60%;
            font-size: 13px;
            font-family: Verdana, sans-serif;
          }
          input:checked + .slider .on {
            display: block;
          }
          .on {
            padding-right: 17px;
            display: none;
            left: 40%;
          }
          input:checked + .slider .off {
            display: none;
          }
          /* Rounded sliders */
          .slider.round {
            border-radius: 34px;
          }
          .slider.round:before {
            border-radius: 50%;
          }
          @media all and (max-width: 900px) {
            .switch {
              right: 22%;
            }
          }
          @media all and (max-width: 650px) {
            .switch {
              width: 101px;
              right: 36%;
            }
            input:checked + .slider:before {
              left: 29px;
            }
          }
          .compare--button {
            margin-bottom: 50px;
          }
          .compare--label {
            position: absolute;
            display: block;
            right: 8%;
            width: 125px;
            height: 34px;
            margin-top: 26px;
          }
          @media all and (max-width: 900px) {
            .compare--label {
              right: 30%;
            }
          }
          @media all and (max-width: 650px) {
            .compare--label {
              right: 50%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default CompareButton;
