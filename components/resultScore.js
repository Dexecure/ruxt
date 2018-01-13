import React from "react";

class ResultScore extends React.Component {
  render() {
    return (
      <div>
        <div className="table__wrapper">
          <div className="seb__wrapper">
            <span className="table__header" title="Site Experience Benchmark (SEB) score: the fraction of users completing first contentful paint within first second.">
              SEB score
            </span>
            <span className="table__content">
              {((this.props.fcp === null) || (this.props.time === 0) || this.props.fcp[this.props.time] === null) ? "-"
                  : this.props.fcp["1"].toFixed(3)}
            </span>
          </div>
          <div className="fcpProb__wrapper">
            <span className="table__header" title="The percentage of users completing first contentful paint within given time.">
              Users with FCP {((this.props.fcp === null) || (this.props.time === 0) || this.props.fcp[this.props.time] === null) ? ""
                : `< ${this.props.time}s`}
            </span>
            <span className="table__content">
              {((this.props.fcp === null) || (this.props.time === 0) || this.props.fcp[this.props.time] === null) ? "-"
                : `${(this.props.fcp[this.props.time] * 100).toFixed(1)}%`}
            </span>
          </div>
          <div className="onloadProb__wrapper">
            <span className="table__header" title="The percentage of users completing document load within given time.">
              Users with onload {((this.props.onload === null) || (this.props.time === 0) || this.props.onload[this.props.time] === null) ? ""
                : `< ${this.props.time}s`}
            </span>
            <span className="table__content">
              {((this.props.onload === null) || (this.props.time === 0) || this.props.onload[this.props.time] === null) ? "-"
                : `${(this.props.onload[this.props.time] * 100).toFixed(1)}%`}
            </span>
          </div>
        </div>
        <style jsx>{`
         .table__header {
            ont-size: 12px;
          }
          .table__content {
            font-size: 30px;
          }
          @media all and (max-width: 965px) {
            .table__header {
              font-size: 10px;
            }
          }
          @media all and (max-width: 890px) {
            .table__header {
              font-size: 9px;
            }
            .table__content {
              font-size: 22px;
            }
          }
          @media all and (max-width: 650px) {
            .URLInput__wrapper {
              display: block;
              width: 92%;
            }
            .table__header {
              font-size: 1.2em;
            }
            .table__content {
              font-size: 3em;
            }
          }
        `}
        </style>
      </div>
    );
  }
}

export default ResultScore;
