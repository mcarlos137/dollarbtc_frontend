import React, { Component } from "react";
import { Container, Segment, Image, Header } from "semantic-ui-react";
import ourDevelopmentsImg from "../../../img/our_developments.png";
import "./WhoWeAre.css";
import translate from "../../../i18n/translate";

class WhoWeAre extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let t = this.props.translate;
    return (
      <Container>
        <Segment basic style={{ marginTop: "30px", textAlign: "justify" }}>
          <Header
            as="h4"
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.us.title")}
          </Header>
          <p className="who-we-are-content">{t("who.us.content")}</p>
          <br />
          <Header
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.products.title")}
          </Header>
          <p className="who-we-are-content">{t("who.products.content")}</p>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Image
              size="large"
              centered
              src={ourDevelopmentsImg}
              style={{ width: "600px" }}
            />
          </div>
          <br />
          <Header
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.opt.title")}
          </Header>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.opt.questions.first.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.opt.questions.first.answer")}
          </p>
          <p className="who-we-are-content">{t("who.opt.items.first")}</p>
          <p className="who-we-are-content">{t("who.opt.items.second")}</p>
          <p className="who-we-are-content">{t("who.opt.items.third")}</p>
          <p className="who-we-are-content">{t("who.opt.items.four")}</p>
          <p className="who-we-are-content">{t("who.opt.items.five")}</p>
          <p className="who-we-are-content">{t("who.opt.items.six")}</p>
          <p className="who-we-are-content">{t("who.opt.items.seven")}</p>
          <p className="who-we-are-content">{t("who.opt.items.eight")}</p>
          <p className="who-we-are-content">{t("who.opt.items.nine")}</p>
          <p className="who-we-are-content">{t("who.opt.items.ten")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p1")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p2")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p3")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p4")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p5")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p6")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p7")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p8")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p9")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p10")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p11")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p12")}</p>
          <p className="who-we-are-content">{t("who.opt.content.p13")}</p>
          <br />
          <Header
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.benefits.title")}
          </Header>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.benefits.questions.first.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.benefits.questions.first.answer")}
          </p>
          <br />
          <Header
            id="how_it_works"
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.functioning.title")}
          </Header>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.functioning.questions.q1.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q1.answer.p1")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q1.answer.p2")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q1.answer.p3")}
          </p>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.functioning.questions.q2.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q2.answer")}
          </p>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }} size="medium">
            {t("who.functioning.questions.q3.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p1")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p2")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p3")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p4")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p5")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p6")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p7")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p8")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p9")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p10")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p11")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p12")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p13")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p14")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p15")}
          </p>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q3.answer.p16")}
          </p>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.functioning.questions.q4.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.functioning.questions.q4.answer")}
          </p>
          <br />
          <Header
            id="strategies"
            style={{ color: "#207ef2", fontWeight: "bold" }}
            size="medium"
          >
            {t("who.strategies.title")}
          </Header>
          <h4 style={{ color: "#207ef2", fontWeight: "bold" }}>
            {t("who.strategies.questions.first.title")}
          </h4>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p1")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p2")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p3")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p4")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p5")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p6")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p7")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p8")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p9")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p10")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p11")}
          </p>
          <p className="who-we-are-content">
            {t("who.strategies.questions.first.answer.p12")}
          </p>
        </Segment>
      </Container>
    );
  }
}

export default translate(WhoWeAre);
