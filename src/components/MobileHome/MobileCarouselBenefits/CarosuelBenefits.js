import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image, Container, Grid, Header, Divider } from "semantic-ui-react";
import power from "../../../img/power.png";
import lock from "../../../img/lock.png";
import x from "../../../img/x.png";
import translate from "../../../i18n/translate";

class CarosuelBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate
    };
  }
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 3 }
  };
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  render() {
    let t = this.state.translator;
    return (
      <Container>
        <Grid>
          <Grid.Row centered textAlign="center">
            <Header textAlign="center">{t("commons.benefits.header")}</Header>
          </Grid.Row>
        </Grid>
        <Divider hidden />
        <Carousel
          id="carousel-mobile-benefits"
          showThumbs={false}
          showArrows={false}
          showStatus={false}
          duration={1000}
          autoPlay={true}
          infinite={true}
          buttonsDisabled={true}
        >
          <Grid>
            <Grid.Row columns="1">
              <Grid.Column mobile={16} textAlign="center">
                <Image src={power} centered id="img-one" />
                <Header as="h5">
                  {t("commons.benefits.items.first.header")}
                </Header>
                <p>{t("commons.benefits.items.first.content")}</p>
              </Grid.Column>
            </Grid.Row>
            <Divider hidden />
          </Grid>
          <Grid>
            <Grid.Row columns="1">
              <Grid.Column mobile={16} textAlign="center">
                <Image src={lock} centered id="img-two" />
                <Header as="h5">
                  {t("commons.benefits.items.second.header")}
                </Header>
                <p>{t("commons.benefits.items.second.content")} </p>
              </Grid.Column>
            </Grid.Row>
            <Divider hidden />
          </Grid>
          <Grid>
            <Grid.Row columns="1">
              <Grid.Column mobile={16} textAlign="center">
                <Image src={x} centered id="img-tree" />
                <Header as="h5">
                  {t("commons.benefits.items.third.header")}
                </Header>
                <p>{t("commons.benefits.items.third.content")}</p>
              </Grid.Column>
            </Grid.Row>
            <Divider hidden />
          </Grid>
        </Carousel>
      </Container>
    );
  }
}

export default translate(CarosuelBenefits);
