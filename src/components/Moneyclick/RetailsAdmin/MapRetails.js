import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import {
  Segment,
  Modal,
  List,
  Grid,
  Form,
  Label,
  Button,
  Card,
  Popup,
  Icon,
  Dropdown,
  Message
} from "semantic-ui-react";
import retails from "../../../services/moneyclick";
class MapRetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataFormat: [],
      viewport: {
        width: 1100,
        height: 400,
        latitude: 10.072752,
        longitude: -69.316039,
        zoom: 10
      },
      // setFuntions: [],
      currencies: [],
      currenciesSave: null,
      id: null,
      title: null,
      description: null,
      latitude: null,
      longitude: null,
      sendPost: false,
      viewMessage: false,
      textMessage: "",
      colorMessage: "",
      loadForm: false
    };
  }
  componentDidMount() {
    this.setState({ load: true });
    let array = [];
    let arrayNoFormat = [];
    retails.getListRetails().then(resp => {
      for (let retail of resp.data) {
        if (retail.id !== "dffrr43t5t5t") {
          let ob = {
            id: retail.id,
            name: retail.title,
            description: retail.description,
            currencies: retail.currencies,
            btcEscrowLimit: retail.btcEscrowLimit,
            active:retail.active
          };

          ob.functionsAvailables = retail.functionsAvailables;
          array.push(ob);
          arrayNoFormat.push(retail);
        }
      }
      this.setState({ dataFormat: array, data: arrayNoFormat, load: false });
    });
  }
  render() {
    return (
      <div>
        <Grid>
          <Grid.Column largeScreen={16} mobile={16} computer={16} tablet={16}>
            <Segment color="orange" loading={this.state.load}>
              <ReactMapGL
                {...this.state.viewport}
                mapboxApiAccessToken={
                  "pk.eyJ1Ijoia29ueTE0OTQiLCJhIjoiY2sybmxvZWlsMDNxYTNjczY1bDJveGhncSJ9.Hfw6xVcid-3EY3ea4QpqrQ"
                }
                onViewportChange={(viewport) => this.setState({ viewport })}
              >
                {this.state.data.map((m) => (
                  <Marker
                    key={m.id}
                    latitude={m.coordinate.latitude}
                    longitude={m.coordinate.longitude}
                  >
                    <Popup
                      trigger={
                        <Icon
                          name="map marker alternate"
                          color={m.active ? "green" : "red"}
                          size="large"
                          circular
                        />
                      }
                      content={
                        "Título : " +
                        m.title +
                        "\n\n" +
                        "Descripción : " +
                        m.description 
                      }
                      position="top left"
                    />
                  </Marker>
                ))}
              </ReactMapGL>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default MapRetails;
