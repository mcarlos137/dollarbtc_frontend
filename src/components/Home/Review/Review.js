import React, { Component } from "react";
import {
  Segment,
  Header,
  Divider,
  Rating,
  Grid,
  Dropdown,
  Dimmer,
  Loader
} from "semantic-ui-react";
import "./Review.css";
import translate from "../../../i18n/translate";
import otc from "../../../services/otc";
import userService from "../../../services/user";
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate,
      lastReviews: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getReviews("5");
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  getReviews(quantity) {
    this.setState({ loading: true });
    otc
      .getReviews(quantity)
      .then(resp => {
        for (let i = 0; i < resp.data.length; i++) {
          let name = "";
          let comment = resp.data[i].comment;
          let id = resp.data[i].operationId;
          let stars = resp.data[i].starsQuantity;
          Object.entries(resp.data[i]).forEach(([k, i]) => {
            if (k === "userName") {
              userService
                .getConfigUserGeneral(i)
                .then(res => {
                  Object.entries(res.data.result).forEach(([key, value]) => {
                    if (key === "nickname") {
                      name = value;
                    } else if (key === "name") {
                      name = value;
                    } else if (key === "email") {
                      name = value;
                    }
                  });
                  let ob = {
                    comment: comment,
                    operationId: id,
                    starsQuantity: stars,
                    userName: name
                  };
                  this.setState({
                    lastReviews: [...this.state.lastReviews, ob]
                  });
                })
                .catch(error => {
                  //console.log(error);
                });
            }
          });
        }
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleReviews(e, data) {
    this.setState({ lastReviews: [] });
    if (data.value === "LAST") {
      this.getReviews("5");
    } else if (data.value === "FEATURED") {
      this.getReviews("5");
    } else if (data.value === "ALL") {
      this.getReviews("50");
    }
  }
  render() {
    let t = this.state.translator;
    return (
      <Segment loading={this.state.loading} inverted color="blue">
        <Header>
          <Header.Content>
            <Dropdown
              inline
              options={[
                {
                  key: "LAST",
                  value: "LAST",
                  text: t("home.review.lastComments")
                },
                {
                  key: "FEATURED",
                  value: "FEATURED",
                  text: t("home.review.featuredComments")
                },
                {
                  key: "ALL",
                  value: "ALL",
                  text: t("home.review.allComments")
                }
              ]}
              defaultValue="LAST"
              onChange={this.handleReviews.bind(this)}
            />
          </Header.Content>
        </Header>
        <hr className="divider-comments" />
        <div className="scroll-comments">
          {this.state.lastReviews.length !== 0 &&
            this.state.lastReviews.map((item, i) => {
              return (
                <Grid key={i}>
                  {this.state.loading && (
                    <Dimmer active>
                      <Loader inverted />
                    </Dimmer>
                  )}
                  <Grid.Row style={{ margin: "-6px 0px -5px 0px" }}>
                    <Grid.Column largeScreen={1} computer={1} />
                    <Grid.Column
                      mobile={4}
                      largeScreen={2}
                      tablet={4}
                      computer={2}
                      textAlign="left"
                    >
                      <Rating
                        icon="star"
                        disabled
                        defaultRating={item.starsQuantity}
                        maxRating={5}
                      />
                    </Grid.Column>
                    <Divider vertical hidden />
                    <Grid.Column
                      mobile={8}
                      largeScreen={10}
                      tablet={8}
                      computer={10}
                      textAlign="left"
                    >
                      <span>{item.comment}</span>
                    </Grid.Column>
                    <Grid.Column
                      mobile={4}
                      largeScreen={2}
                      tablet={4}
                      computer={2}
                      textAlign="left"
                    >
                      <span>{item.userName}</span>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              );
            })}
        </div>
      </Segment>
    );
  }
}
export default translate(Review);
