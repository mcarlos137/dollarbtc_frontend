import React, { Component } from "react";
import { Grid, Segment, Image, Divider } from "semantic-ui-react";
import "./CreditIconsHome.css";
import Carousel from "react-alice-carousel";
import CreditIcon1 from "../../../img/BSI.jpg";
import CreditIcon2 from "../../../img/pci.jpg";
import CreditIcon3 from "../../../img/Mastercard-logo.png";
import CreditIcon4 from "../../../img/Visa_Logo.png";
import CreditIcon5 from "../../../img/google-pay-badge.png";
import CreditIcon6 from "../../../img/apple-pay.png";
//import { isMobile } from "react-device-detect";
//import mc from "../../../img/logoNuevoMC.jpg";

class CreditIconsHome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(window.innerWidth);
    return (
      <div>
        {window.innerWidth >= 430 && (
          <div>
            <Grid
              columns={6}
              verticalAlign={"middle"}
              style={{
                width: "80%",
                marginTop: "10px",
                marginLeft:
                  window.innerWidth >= 430 && window.innerWidth <= 800
                    ? 150
                    : 200
              }}
            >
              <Grid.Row>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon1}
                    //size="large"
                    style={{ marginTop: "5px", width: "100px" }}
                  />
                </Grid.Column>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon2}
                    size="medium"
                    style={{ marginBottom: "5px", marginTop: "10px" }}
                  />
                </Grid.Column>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon3}
                    //size="tiny"
                    style={{ marginLeft: "10px", width: "65px" }}
                  />
                </Grid.Column>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon4}
                    //size="large"
                    style={{
                      marginTop: "-1px",
                      marginRigth: "10px",
                      width: "120px"
                    }}
                  />
                </Grid.Column>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon5}
                    //size="tiny"
                    style={{
                      marginTop: "10px",
                      marginLeft: "10px",
                      width: "80px"
                    }}
                  />
                </Grid.Column>
                <Grid.Column computer={2} largeScreen={2}>
                  <Image
                    src={CreditIcon6}
                    //size="tiny"
                    style={{
                      marginTop: "10px",
                      marginRigth: "25px",
                      width: "80px"
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {/* <Divider hidden/>
                  <Image
                  src= {mc}
                  size="small"
                  href="#"
                  style={{marginLeft:"40%"}}>

                  </Image>  */}
          </div>
        )}

        {window.innerWidth <= 429 && (
          <div>
            <Segment>
              <Grid>
                <Grid.Row>
                  <Grid.Column
                    largeScreen={2}
                    tablet={2}
                    mobile={2}
                    widescreen={2}
                  />
                  <Grid.Column
                    largeScreen={12}
                    tablet={12}
                    mobile={12}
                    widescreen={12}
                  >
                    <Carousel
                      id="carousel-creditIconsHome"
                      showThumbs={false}
                      showArrows={true}
                      showStatus={false}
                      duration={3000}
                      autoPlay={true}
                      infinite={true}
                      buttonsDisabled={true}
                      responsive={this.responsive}
                    >
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon1}
                              className="carousel-credit"
                              style={{
                                marginTop: "10px",
                                width: "105px",
                                height: "50px"
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon2}
                              className="carousel-credit"
                              style={{
                                width: "105px"
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon3}
                              className="carousel-credit-3"
                              style={{
                                width: "95px"
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon4}
                              className="carousel-credit"
                              style={{
                                width: "100px",
                                marginTop: "20px"
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon5}
                              className="carousel-credit"
                              style={{
                                width: 90,
                                marginTop: 10
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <Grid>
                        <Grid.Row>
                          <Grid.Column
                            mobile={16}
                            textAlign="center"
                            stretched={true}
                            verticalAlign="middle"
                          >
                            <Image
                              src={CreditIcon6}
                              className="carousel-credit-6"
                              style={{
                                width: 85,
                                marginTop: 10
                              }}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Carousel>
                  </Grid.Column>
                  <Grid.Column
                    largeScreen={2}
                    tablet={2}
                    mobile={2}
                    widescreen={2}
                  />
                </Grid.Row>
              </Grid>
            </Segment>

            {/* <Image
                  src= {mc}
                  size="small"
                  href="#"
                  style={{marginLeft:"30%"}}>

                  </Image>  */}
          </div>
        )}
      </div>
    );
  }
}
export default CreditIconsHome;
