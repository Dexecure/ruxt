import React from "react";
import ReactModal from "react-modal";
import Meta from "./meta";

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },
  content: {
    border: "1px solid",
    borderRadius: "4px",
    bottom: "auto",
    minHeight: "10rem",
    left: "50%",
    padding: "2rem",
    position: "fixed",
    right: "auto",
    top: "50%",
    transform: "translate(-50%,-50%)",
    minWidth: "20rem",
    width: "40%",
    maxWidth: "60rem"
  }
};

class subscribeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      website: ""
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    (function($) {
      window.fnames = new Array();
      window.ftypes = new Array();
      fnames[0] = "EMAIL";
      ftypes[0] = "email";
      fnames[1] = "WEBSITE";
      ftypes[1] = "url";
    })(jQuery);
    var $mcj = jQuery.noConflict(true);
  }

  handleCloseModal() {
    this.props.handleCloseModal();
  }

  render() {
    return (
      <div>
        <Meta />
        <ReactModal
          isOpen={this.props.isOpen}
          handleCloseModal={this.handleCloseModal}
          style={customStyles}
        >
          <button onClick={this.handleCloseModal} className="cancel__button">
            <img src="static/cancel.png" alt="cancel" />
          </button>
          <div id="mc_embed_signup">
            <form
              action="https://dexecure.us13.list-manage.com/subscribe/post?u=cee295e339d357e91dc6cc2bd&amp;id=1605b04a8c"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              className="validate"
              target="_blank"
              noValidate
            >
              <div id="mc_embed_signup_scroll">
                <h2>Subscribe to our mailing list</h2>
                <div className="indicates-required">
                  <span className="asterisk">*</span> indicates required
                </div>
                <div className="mc-field-group">
                  <label htmlFor="mce-EMAIL">
                    Email Address <span className="asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    value={this.state.email}
                    onChange={e => {
                      this.setState({ email: e.target.value });
                    }}
                    name="EMAIL"
                    className="required email"
                    id="mce-EMAIL"
                  />
                </div>
                <div className="mc-field-group">
                  <label htmlFor="mce-WEBSITE">Website </label>
                  <input
                    type="url"
                    value={this.state.website}
                    onChange={e => {
                      this.setState({ website: e.target.value });
                    }}
                    name="WEBSITE"
                    className=" url"
                    id="mce-WEBSITE"
                  />
                </div>
                <div id="mce-responses" className="clear">
                  <div
                    className="response"
                    id="mce-error-response"
                    style={{ display: "none" }}
                  />
                  <div
                    className="response"
                    id="mce-success-response"
                    style={{ display: "none" }}
                  />
                </div>
                <div
                  style={{ position: "absolute", left: "-5000px" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_652bd846a8030f92589232e40_063449abf9"
                    tabIndex="-1"
                    value=""
                  />
                </div>
                <div className="clear">
                  <input
                    type="submit"
                    value="Subscribe"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    className="button"
                  />
                </div>
              </div>
            </form>
          </div>
        </ReactModal>
        <style jsx>
          {`
            #mc_embed_signup {
              background: #fff;
              clear: left;
              font: 14px Helvetica, Arial, sans-serif;
              width: 500px;
            }
          `}
        </style>
      </div>
    );
  }
}

export default subscribeModal;
