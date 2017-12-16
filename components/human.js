import React from "react";

class Human extends React.Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="7.844" height="18.163" viewBox="0 0 7.844 18.163" style={{ fill: this.props.color, stroke: "#153b58" }}><path d="M.507 6.568v4.797a.92.92 0 0 0 .917.917h.351v4.324a.92.92 0 0 0 .917.917h2.46a.92.92 0 0 0 .917-.917v-4.34h.351a.92.92 0 0 0 .917-.916V6.568a.92.92 0 0 0-.917-.917H1.424a.91.91 0 0 0-.917.917z" strokeWidth=".153" /><circle cx="3.914" cy="2.764" r="2.124" strokeWidth=".153" /></svg>
    );
  }
}

export default Human;
