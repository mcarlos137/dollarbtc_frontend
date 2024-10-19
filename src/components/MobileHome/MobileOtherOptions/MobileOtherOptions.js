import React, { Component } from "react";
import { Grid, Segment, Image, Button, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../MobileHome.css";
import translate from "../../../i18n/translate";

class MobileOtherOptions extends Component {
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
      //       <Grid.Column mobile={7} tablet={8} verticalAlign="middle">
      //         <div className="other-options">
      //           <p style={{ lineHeight: "-20px" }}>
      //             {t("homeMobile.otherOptions.header")}
      //           </p>
      //         </div>
      //       </Grid.Column>
      //       <Grid.Column mobile={9} tablet={8}>
      //         <Link
      //           to="/profile"
      //           name="profile"
      //           onClick={this.setItem.bind(this)}
      //         >
      //           <p className="content-menu">
      //             <span style={{ color: "#207ef2 ", marginLeft: "2px" }}>
      //               {t("homeMobile.otherOptions.content.profile")}
      //             </span>
      //           </p>
      //         </Link>
      //         <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
      //         <Link to="/forum" name="forum" onClick={this.setItem.bind(this)}>
      //           <p className="content-menu">
      //             <span style={{ color: "#207ef2 ", marginLeft: "2px" }}>
      //               {t("homeMobile.otherOptions.content.forum")}
      //             </span>
      //           </p>
      //         </Link>
      //         <Divider hidden style={{ margin: "4px 0px 4px 0px" }} />
      //         {window.sessionStorage.getItem("retail") !== null && (
      //           <Link
      //             to="/moneyclick"
      //             name="moneyclick"
      //             onClick={this.setItem.bind(this)}
      //           >
      //             <p className="content-menu">
      //               <span style={{ color: "#207ef2 ", marginLeft: "2px" }}>
      //                 {t("homeMobile.otherOptions.content.retail")}
      //               </span>
      //             </p>
      //           </Link>
      //         )}
              
      //       </Grid.Column>
      //     </Grid.Row>
      //   </Grid>
      // </Segment>
      <Segment raised secondary>
        <div align="center">
        <label textAlign="center"><strong>{t("homeMobile.otherOptions.header")}</strong></label>
        </div>
      <Grid style={{marginTop:10}}>
        <Grid.Row>
          <Grid.Column mobile={8} tablet={8} textAlign="center">
          <Button  color='blue' to="/profile"
                 name="profile"
                 onClick={this.setItem.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"130px"}}>
            {t("homeMobile.otherOptions.content.profile")}
          </Button>
        
          </Grid.Column>
          <Grid.Column mobile={8} tablet={8} textAlign="center">
          <Button  color='blue' to="/forum" name="forum" onClick={this.setItem.bind(this)} style={{borderRadius:"40px/40px",height:"50px",width:"130px"}}>
          {t("homeMobile.otherOptions.content.forum")}
          </Button>
            
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
    );
  }
}

export default translate(MobileOtherOptions);
