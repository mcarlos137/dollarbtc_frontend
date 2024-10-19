import React, { Component ,Responsive} from "react";
import "../BuyBitcoins.css";
import { Grid, Message } from "semantic-ui-react";
export default class FormWaitingVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItemMessages: [],
      listItemDataToVerify: []
    };
  }

  componentDidMount() {}
  render() {
    return (
      <div>
        <Message info content={this.state.listItemMessages} />
        <Grid columns="equal">
          <Grid.Row centered>
            <Grid.Column largeScreen={8} mobile={16} tablet={16} computer={8}>
              <Message info content={this.state.listItemDataToVerify} />
            </Grid.Column>
            <Grid.Column largeScreen={8} mobile={16} tablet={16} computer={8} />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
