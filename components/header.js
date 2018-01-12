import React from "react";

class Header extends React.Component {
  render() {
    return (
      <div>
        <header className="dashboard--header">
          <div className="l">
            <div className="header--left">
              <a className="header--logo" href="/">
                <img src="static/full-logo-white.png" alt="RUXtest | Dexecure" />
              </a>
            </div>
            <div className="header--middle">
              <label htmlFor="togBtn" className="switch">
                <input onClick={this.props.handleClick} defaultChecked={this.props.checked} type="checkbox" id="togBtn" />
                <div className="slider round">
                  <span className="on">
                    Compare
                  </span>
                  <span className="off">
                    Test
                  </span>
                </div>
              </label>
            </div>
            <div className="header--right">
              <a className="btn" href="https://dexecure.com">Try Dexecure</a>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
