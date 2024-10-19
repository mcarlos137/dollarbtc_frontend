import React, { Component } from "react";
import { Grid, Segment, Image, Button, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../MobileHome.css";
import translate from "../../../i18n/translate";

class MobileOperations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translator: props.translate
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  setItem(e, data) {
    this.props.setItem(data.name);
  }
  render() {
    let t = this.state.translator;
    return (
      // <Segment raised color="blue">
      //   <Grid>
      //     <Grid.Row>
      //       <Grid.Column mobile={7} tablet={8} textAlign="center">
      //         {/* <Image src={operations} id="img-operations" /> */}
      //         <div className="label-home-mobile">
      //           <span>{t("homeMobile.operations.header")}</span>
      //         </div>
      //       </Grid.Column>
      //       <Grid.Column mobile={9} tablet={8} textAlign="center">
      //         <Link to="/buy" name="buy" onClick={this.setItem.bind(this)}>
      //           <p className="content-menu">
      //             <span style={{ color: "#207ef2 ", marginLeft: "2px" }}>
      //               {t("homeMobile.operations.button.buy")}
      //             </span>
      //           </p>
      //         </Link>
      //         <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
      //         <Link to="/sell" name="sell" onClick={this.setItem.bind(this)}>
      //           <p className="content-menu">
      //             <span style={{ color: "#207ef2 ", marginLeft: "2px" }}>
      //               {t("homeMobile.operations.button.sell")}
      //             </span>
      //           </p>
      //         </Link>
      //       </Grid.Column>
      //     </Grid.Row>
      //   </Grid>
      // </Segment>
      <Segment raised secondary>
        <div align="center">
        <label textAlign="center"><strong>{t("homeMobile.operations.header")}</strong></label>
        </div>
      <Grid style={{marginTop:10}}>
        <Grid.Row>
          <Grid.Column mobile={8} tablet={8} textAlign="center">
          <Button 
          color='blue' 
          to="/buy" name="buy" onClick={this.setItem.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"130px"}}>
            {t("homeMobile.operations.button.buy")}
          </Button>
        
          </Grid.Column>
          <Grid.Column mobile={8} tablet={8} textAlign="center">
          <Button color='blue' to="/sell" name="sell" onClick={this.setItem.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"130px"}}>
          {t("homeMobile.operations.button.sell")}
          </Button>
            
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    );
  }
}

export default translate(MobileOperations);
