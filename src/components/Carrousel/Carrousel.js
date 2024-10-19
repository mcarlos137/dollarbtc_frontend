import React, { Component } from "react";
import "./Carrousel.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image, Button } from "semantic-ui-react";
import accountES from "../../img/banner-cuenta.jpg";
import accountEN from "../../img/banner-cuenta-ing.jpg";
import hftES from "../../img/banner-plazo-fijo.jpg";
import hftEN from "../../img/banner-plazo-fijo-eng.jpg";
import depositES from "../../img/banner-trans-depo.jpg";
import depositEN from "../../img/banner-trans-depo-eng.jpg";
import { Link } from "react-router-dom";
import translate from "../../i18n/translate";
class Carrousel extends Component {
  constructor(props) {
    super(props);
    this.refCarrousel = React.createRef();
    this.state = {
      thumbs: false,
      arrows: true,
      interval: 8000,

      auto: true,
      loop: true,
      status: false,
      auth: sessionStorage.getItem("auth") === "true",
      translator: props.translate,
    };
    this._isMounted = false;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate,
      });
    }
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  goRegistration() {
    window.location.href = "/registration";
  }
  render() {
    let t = this.state.translator;
    let buttonAccount = (
      <Button
        style={{
          backgroundColor: "#207ef2",
          color: "white",
          fontWeight: "bold",
        }}
        className="square"
      >
        {t("carousel.openAccount")}
      </Button>
    );
    let buttonAccount2 = (
      <Button
        style={{
          backgroundColor: "#207ef2",
          color: "white",
          fontWeight: "bold",
        }}
        className="square2"
      >
        {t("carousel.openAccount")}
      </Button>
    );
    let buttonAccount3 = (
      <Button
        style={{
          backgroundColor: "#207ef2",
          color: "white",
          fontWeight: "bold",
        }}
        className="square3"
      >
        {t("carousel.openAccount")}
      </Button>
    );
    return (
      <Carousel
        transitionTime={1000}
        stopOnHover={false}
        ref={this.refCarrousel}
        showThumbs={this.state.thumbs}
        showArrows={this.state.arrows}
        showStatus={this.state.status}
        interval={this.state.interval}
        autoPlay={this.state.auto}
        infiniteLoop={this.state.loop}
      >
        <div>
          <Image
            src={this.props.language === "es" ? accountES : accountEN}
            alt=""
          />
          {!this.state.auth && <Link to="/registration">{buttonAccount}</Link>}
          {this.state.auth && buttonAccount}
        </div>
        <div>
          <Image src={this.props.language === "es" ? hftES : hftEN} alt="" />
          {!this.state.auth && <Link to="/registration">{buttonAccount2}</Link>}
          {this.state.auth && buttonAccount2}
        </div>
        <div>
          <Image
            src={this.props.language === "es" ? depositES : depositEN}
            alt=""
          />
          {!this.state.auth && <Link to="/registration">{buttonAccount3}</Link>}
          {this.state.auth && buttonAccount3}
        </div>
      </Carousel>
    );
  }
}
export default translate(Carrousel);
