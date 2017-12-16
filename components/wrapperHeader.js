import React from "react";

class wrapperHeader extends React.Component {
  render() {
    return (
      <header className="dashboard--header">
        <div className="l">
          <div className="header--left">
            <a className="header--logo" href="/dashboard">
              <img src="static/full-logo-white.png" alt="Dexecure Dashboard" />
            </a>
          </div>
          <div className="header--right">
            <button className="dashboard--logout">
              <span className="dashboard--logout-text">Sign out</span>
              <img className="dashboard--logout-image" src="/static/exit.png" alt="logout" />
            </button>
          </div>
        </div>
        <style jsx>
          {`
            .dashboard--header {
              background-color: #153B58;
            }
            .dashboard--header .l {
              display: flex;
              justify-content: space-between;
              padding: 1em;
              align-items: center;
            }
            .header--logo {
              max-width: 10em;
              display: inline-block;
            }
            .dashboard--logout-image {
              max-width: 25px;
            }
            .dashboard--logout {
              background-color: #153B58;
              border: 1px solid #153B58;
            }
            .dashboard--logout {
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .dashboard--logout-text {
              color: #ffffff;
              padding: .3em .5em;
            }
          `}
        </style>
      </header>
    );
  }
}

export default wrapperHeader;
