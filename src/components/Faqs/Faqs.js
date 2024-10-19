import React, { Component } from "react";
import {
  Container,
  Accordion,
  Icon,
  Header,
  Grid,
  Segment,
  Responsive,Divider
} from "semantic-ui-react";
import "./Faqs.css";
import translate from "../../i18n/translate";

class Faqs extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0, translator: props.translate };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };
  componentDidMount() {
    this.setState({
      translator: this.props.translate
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  render() {
    let t = this.state.translator;
    const { activeIndex } = this.state;

    return (
      <div>
      <Responsive minWidth={992} >
      <Container>
        <Grid columns={1}>
          <Grid.Column largeScreen={16} mobile={16} tablet={16} computer={16}>
            <Container>
              <Segment color="orange" >
                <Header
                  as="h4"
                  style={{
                    color: "#207ef2",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingTop: 20
                  }}
                  size= "medium"
                >
                  {t("faqs.title")}
                </Header>
                <Container >
                  <Accordion fluid styled
                  >
                    <Accordion.Title
                      active={activeIndex === 0}
                      index={0}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===0?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q1.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                     style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}

                      active={activeIndex === 0}
                    >
                      <p className="faqs-content"  > 
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q1.answer.link")}</a>
                        {t("faqs.questions.q1.answer.p1")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p2")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p3")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p4")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p5")}
                      </p>
                      <p className="faqs-content" >
                        <u>{t("faqs.questions.q1.answer.p6")}</u>
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p7")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p8")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p9")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p10")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p11")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p12")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p13")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p14")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p15")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q1.answer.link")}</a>
                        {t("faqs.questions.q1.answer.p16")}
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 1}
                      index={1}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===1?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q2.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 1}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="bleeding">
                        <li>{t("faqs.questions.q2.answer.p1")}</li>
                        <li>{t("faqs.questions.q2.answer.p2")}</li>
                        <li>{t("faqs.questions.q2.answer.p3")}</li>
                        <li>{t("faqs.questions.q2.answer.p4")}</li>
                        <li>{t("faqs.questions.q2.answer.p5")}</li>
                        <li>{t("faqs.questions.q2.answer.p6")}</li>
                        
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 2}
                      index={2}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===2?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q3.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 2}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p2")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q3.answer.link")}
                        </a>
                        {t("faqs.questions.q3.answer.p3")}
                        <b>{t("faqs.questions.q3.answer.p4")}</b>
                        {t("faqs.questions.q3.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p6")}
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 3}
                      index={3}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===3?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q4.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 3}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q4.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q4.answer.p2")}
                      </p>
                      <p className="faqs-link">
                        <a className="faqs-content" href="https://bitcoin.org/en/exchanges#international" target="_blank" rel="noopener noreferrer">
                        {t("faqs.questions.q4.answer.link")}
                      </a>
                      </p>
                                           
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 4}
                      index={4}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===4?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q5.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 4}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <p className="faqs-content">
                        {t("faqs.questions.q5.answer.p1")}
                       </p>
                       <p className="bleeding">
                        <li>{t("faqs.questions.q5.answer.p2")}</li>
                        <li>{t("faqs.questions.q5.answer.p3")}</li>
                        <li>{t("faqs.questions.q5.answer.p4")}</li>
                        <li>{t("faqs.questions.q5.answer.p5")}</li>
                        <li>{t("faqs.questions.q5.answer.p6")}</li>
                        
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 5}
                      index={5}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===5?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q6.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 5}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q6.answer.p1")}
                        <b>{t("faqs.questions.q6.answer.p2")}</b>
                        {t("faqs.questions.q6.answer.p3")}
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 6}
                      index={6}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===6?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q7.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 6}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p1")}
                        <b>{t("faqs.questions.q7.answer.p2")}</b>
                        {t("faqs.questions.q7.answer.p3")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q7.answer.p4")}</li>
                        <li>{t("faqs.questions.q7.answer.p5")}</li>
                        <li>{t("faqs.questions.q7.answer.p6")}</li>
                        <li>{t("faqs.questions.q7.answer.p7")}</li>
                        <li>{t("faqs.questions.q7.answer.p8")}</li>
                        <li>{t("faqs.questions.q7.answer.p9")}</li>
                        <li>{t("faqs.questions.q7.answer.p10")}</li>
                        <li>{t("faqs.questions.q7.answer.p11")}</li>
                        <li>
                          {t("faqs.questions.q7.answer.p12")}
                          <b>{t("faqs.questions.q7.answer.p13")}</b>
                        </li>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p14")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p15")}
                        <b>{t("faqs.questions.q7.answer.p16")}</b>
                        {t("faqs.questions.q7.answer.p17")}
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 7}
                      index={7}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===7?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q8.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 7}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p3")}
                        <b>{t("faqs.questions.q8.answer.p4")}</b>
                        {t("faqs.questions.q8.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p6")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://coin.dance/poli" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p7")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p8")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.imolin.org/pdf/imolin/overviews.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p9")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p10")}</b>
                        {t("faqs.questions.q8.answer.p11")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.bis.org/publ/bcbs275_es.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p12")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p13")}</b>
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.consumerfinance.gov/es/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p14")}
                      </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p15")}</b>
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.fincen.gov/sites/default/files/shared/money_transmitters_regulators.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p16")}
                      </a>
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 8}
                      index={8}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===8?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q9.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 8}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q9.answer.p1")}
                        <b>{t("faqs.questions.q9.answer.p2")}</b>
                        {t("faqs.questions.q9.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q9.answer.p4")}
                      </p>
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 9}
                      index={9}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===9?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q10.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 9}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q10.answer.p1")}
                        <b>{t("faqs.questions.q10.answer.p2")}</b>
                        {t("faqs.questions.q10.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q10.answer.p4")}
                      </p>
                      
                    </Accordion.Content>
                    <Accordion.Title
                      active={activeIndex === 10}
                      index={10}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===10?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q11.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 10}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p1")}
                        <b>{t("faqs.questions.q11.answer.p2")}</b>
                        {t("faqs.questions.q11.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p5")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q11.answer.p6")}</li>
                        <li>{t("faqs.questions.q11.answer.p7")}</li>
                        <li>{t("faqs.questions.q11.answer.p8")}</li>
                      </p>
                      
                        
                    </Accordion.Content>
                   
                    <Accordion.Title
                      active={activeIndex === 11}
                      index={11}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===11?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q12.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 11}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q12.answer.p1")}
                        <b>{t("faqs.questions.q12.answer.p2")}</b>
                        {t("faqs.questions.q12.answer.p3")}
                      </p>
                      
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 12}
                      index={12}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===12?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q13.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 12}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p3")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 13}
                      index={13}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===13?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q14.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 13}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q14.answer.p1")}
                        <b>{t("faqs.questions.q14.answer.p2")}</b>
                        {t("faqs.questions.q14.answer.p3")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q14.answer.p4")}</li>
                        <li>{t("faqs.questions.q14.answer.p5")}</li>
                        <li>{t("faqs.questions.q14.answer.p6")}</li>
                        <li>{t("faqs.questions.q14.answer.p7")}
                          <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q14.answer.p8")}
                      </a>
                        </li>
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 14}
                      index={14}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===14?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q15.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 14}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="bleeding">
                        <li>{t("faqs.questions.q15.answer.p1")}</li>
                        <li>{t("faqs.questions.q15.answer.p2")}</li>
                        <li>{t("faqs.questions.q15.answer.p3")}</li>
                        <li>{t("faqs.questions.q15.answer.p4")}</li>
                        <li>{t("faqs.questions.q15.answer.p5")}</li>
                        <li>{t("faqs.questions.q15.answer.p6")}</li>
                        <li>{t("faqs.questions.q15.answer.p7")}</li>
                        <li>{t("faqs.questions.q15.answer.p8")}</li>
                        <li>{t("faqs.questions.q15.answer.p9")}</li>
                        <li>{t("faqs.questions.q15.answer.p10")}</li>
                        <li>{t("faqs.questions.q15.answer.p11")}</li>
                        <li>{t("faqs.questions.q15.answer.p12")}</li>
                        <li>{t("faqs.questions.q15.answer.p13")}</li>
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 15}
                      index={15}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===15?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q16.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 15}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p2")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p4")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p5")}
                        <b>{t("faqs.questions.q16.answer.acronym2")}</b>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p6")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p7")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p8")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p9")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p10")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 16}
                      index={16}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===16?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q17.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 16}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="bleeding">
                        <li>{t("faqs.questions.q17.answer.p1")}</li>
                        <li>{t("faqs.questions.q17.answer.p2")}</li>
                        <li>{t("faqs.questions.q17.answer.p3")}</li>
                        <li>{t("faqs.questions.q17.answer.p4")}</li>
                        <li>{t("faqs.questions.q17.answer.p5")}</li>
                        <li>{t("faqs.questions.q17.answer.p6")}</li>
                        <li>{t("faqs.questions.q17.answer.p7")}</li>
                        <li>{t("faqs.questions.q17.answer.p8")}</li>
                        <li>{t("faqs.questions.q17.answer.p9")}</li>
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 17}
                      index={17}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===17?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q18.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 17}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q18.answer.p1")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q18.answer.link")}
                        </a>
                        {t("faqs.questions.q18.answer.p2")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 18}
                      index={18}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===18?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q19.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 18}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="bleeding">
                        <li>{t("faqs.questions.q19.answer.p1")}</li>
                        <li>{t("faqs.questions.q19.answer.p2")}</li>
                        <li>
                          {t("faqs.questions.q19.answer.p3")}
                          <i>{t("faqs.questions.q19.answer.p4")}</i>
                          {t("faqs.questions.q19.answer.p5")}
                       </li>
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 19}
                      index={19}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===19?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q20.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 19}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="bleeding">
                        <li>{t("faqs.questions.q20.answer.p1")}</li>
                        <li>{t("faqs.questions.q20.answer.p2")}</li>
                        <li>
                          {t("faqs.questions.q20.answer.p3")}
                        <b>{t("faqs.questions.q20.answer.p4")}</b>
                          {t("faqs.questions.q20.answer.p5")}
                        </li>
                        <li>{t("faqs.questions.q20.answer.p6")}</li>
                        <li>{t("faqs.questions.q20.answer.p7")}</li>
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q20.answer.p8")}</u>
                        {t("faqs.questions.q20.answer.p9")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 20}
                      index={20}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===20?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q21.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 20}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q21.answer.p1")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 21}
                      index={21}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===21?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q22.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 21}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q22.answer.p1")}
                      </p>
                    </Accordion.Content>
                  
                  
                    <Accordion.Title
                      active={activeIndex === 22}
                      index={22}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===22?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q23.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 22}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p4")}
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 23}
                      index={23}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===23?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q24.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 23}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q24.answer.p1")}
                      </p>
                    </Accordion.Content>
                  
                    <Accordion.Title
                      active={activeIndex === 24}
                      index={24}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===24?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q25.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 24}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q25.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q25.answer.p2")}
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 25}
                      index={25}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===25?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q26.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 25}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p3")}
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 26}
                      index={26}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===26?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q27.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 26}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p5")}
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 27}
                      index={27}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===27?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q28.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 27}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q28.answer.p3")}</u>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q28.answer.p6")}</b>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p7")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p8")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p9")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p10")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q28.answer.p11")}</li>
                        <li>{t("faqs.questions.q28.answer.p12")}</li>
                        <li>{t("faqs.questions.q28.answer.p13")}</li>
                        <li>{t("faqs.questions.q28.answer.p14")}</li>
                        <li>{t("faqs.questions.q28.answer.p15")}</li>
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q28.answer.p16")}</u>
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q28.answer.p17")}</li>
                        <li>{t("faqs.questions.q28.answer.p18")}</li>
                        <li>{t("faqs.questions.q28.answer.p19")}</li>
                        <li>{t("faqs.questions.q28.answer.p20")}</li>
                        <li>{t("faqs.questions.q28.answer.p21")}</li>
                        <li>{t("faqs.questions.q28.answer.p22")}</li>
                      </p>
                    </Accordion.Content>

                    <Accordion.Title
                      active={activeIndex === 28}
                      index={28}
                      onClick={this.handleClick.bind(this)}
                    >
                      <p className="faqs-title" style={activeIndex===28?{color: "#207ef2"}:{}}>
                        <Icon name="dropdown" />
                        {t("faqs.questions.q29.title")}
                      </p>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 28}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                      <p className="faqs-content">
                        {t("faqs.questions.q29.answer.p1")}
                      </p>
                    </Accordion.Content>
                  </Accordion>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid>
      </Container>
      </Responsive>
      <Responsive minWidth={0} maxWidth={991} >
        <Container>
        <Grid columns={1}>
          <Grid.Column largeScreen={16} mobile={16} tablet={16} computer={16}>
            <Divider hidden></Divider>
            <Container>
                <Header
                  as="h4"
                  style={{
                    color: "#207ef2",
                    fontWeight: "bold",
                    textAlign: "center",
                    paddingTop: 20
                  }}
                  className="titleComponent"
                  size= "medium"
                >
                  {t("faqs.title")}
                </Header>
                <Container >
                <hr style={{ borderColor:"#207ef2" }} ></hr> 
                <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >
                    <Accordion.Title
                      active={activeIndex === 0}
                      index={0}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                    <p className="faqs-title">
                                  
                                  {t("faqs.questions.q1.title")}
                                </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                                  <Icon name="chevron down" size="large" />
                      </Grid.Column> 
                      </Grid> 
                      
                    </Accordion.Title>
                    <Accordion.Content
                     style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}

                      active={activeIndex === 0}
                    >
                      <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40 }} ></hr>
                      <p className="faqs-content"  > 
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q1.answer.link")}</a>
                        {t("faqs.questions.q1.answer.p1")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p2")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p3")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p4")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p5")}
                      </p>
                      <p className="faqs-content" >
                        <u>{t("faqs.questions.q1.answer.p6")}</u>
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p7")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p8")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p9")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p10")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p11")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p12")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p13")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p14")}
                      </p>
                      <p className="faqs-content" >
                        {t("faqs.questions.q1.answer.p15")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q1.answer.link")}</a>
                        {t("faqs.questions.q1.answer.p16")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 1}
                      index={1}
                      onClick={this.handleClick.bind(this)}
                    >
                   
                     
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q2.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                                  <Icon name="chevron down" size="large" />
                      </Grid.Column> 
                      </Grid>

                      
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 1}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q2.answer.p1")}</li>
                        <li>{t("faqs.questions.q2.answer.p2")}</li>
                        <li>{t("faqs.questions.q2.answer.p3")}</li>
                        <li>{t("faqs.questions.q2.answer.p4")}</li>
                        <li>{t("faqs.questions.q2.answer.p5")}</li>
                        <li>{t("faqs.questions.q2.answer.p6")}</li>
                        
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 2}
                      index={2}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===2?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q3.title")}
                        </p>
                        </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                        <Icon name="chevron down" size="large"/>
                     
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 2}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p2")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q3.answer.link")}
                        </a>
                        {t("faqs.questions.q3.answer.p3")}
                        <b>{t("faqs.questions.q3.answer.p4")}</b>
                        {t("faqs.questions.q3.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q3.answer.p6")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 3}
                      index={3}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===3?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q4.title")}
                        
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 3}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q4.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q4.answer.p2")}
                      </p>
                      <p className="faqs-link">
                        <a className="faqs-content" href="https://bitcoin.org/en/exchanges#international" target="_blank" rel="noopener noreferrer">
                        {t("faqs.questions.q4.answer.link")}
                      </a>
                      </p>
                                           
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 4}
                      index={4}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===4?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q5.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 4}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                       <p className="faqs-content">
                        {t("faqs.questions.q5.answer.p1")}
                       </p>
                       <p className="bleeding">
                        <li>{t("faqs.questions.q5.answer.p2")}</li>
                        <li>{t("faqs.questions.q5.answer.p3")}</li>
                        <li>{t("faqs.questions.q5.answer.p4")}</li>
                        <li>{t("faqs.questions.q5.answer.p5")}</li>
                        <li>{t("faqs.questions.q5.answer.p6")}</li>
                        
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 5}
                      index={5}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===5?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q6.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 5}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q6.answer.p1")}
                        <b>{t("faqs.questions.q6.answer.p2")}</b>
                        {t("faqs.questions.q6.answer.p3")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 6}
                      index={6}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===6?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q7.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 6}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p1")}
                        <b>{t("faqs.questions.q7.answer.p2")}</b>
                        {t("faqs.questions.q7.answer.p3")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q7.answer.p4")}</li>
                        <li>{t("faqs.questions.q7.answer.p5")}</li>
                        <li>{t("faqs.questions.q7.answer.p6")}</li>
                        <li>{t("faqs.questions.q7.answer.p7")}</li>
                        <li>{t("faqs.questions.q7.answer.p8")}</li>
                        <li>{t("faqs.questions.q7.answer.p9")}</li>
                        <li>{t("faqs.questions.q7.answer.p10")}</li>
                        <li>{t("faqs.questions.q7.answer.p11")}</li>
                        <li>
                          {t("faqs.questions.q7.answer.p12")}
                          <b>{t("faqs.questions.q7.answer.p13")}</b>
                        </li>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p14")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q7.answer.p15")}
                        <b>{t("faqs.questions.q7.answer.p16")}</b>
                        {t("faqs.questions.q7.answer.p17")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 7}
                      index={7}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title" style={activeIndex===7?{color: "#207ef2"}:{}}>
                        {t("faqs.questions.q8.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 7}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p3")}
                        <b>{t("faqs.questions.q8.answer.p4")}</b>
                        {t("faqs.questions.q8.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p6")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://coin.dance/poli" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p7")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q8.answer.p8")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.imolin.org/pdf/imolin/overviews.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p9")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p10")}</b>
                        {t("faqs.questions.q8.answer.p11")}
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.bis.org/publ/bcbs275_es.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p12")}
                        </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p13")}</b>
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.consumerfinance.gov/es/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p14")}
                      </a>
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q8.answer.p15")}</b>
                      </p>
                      <p className="faqs-content">
                        <a href="https://www.fincen.gov/sites/default/files/shared/money_transmitters_regulators.pdf" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q8.answer.p16")}
                      </a>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 8}
                      index={8}
                      onClick={this.handleClick.bind(this)}
                    >
                        <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q9.title")}
                      </p>
                      
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 8}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q9.answer.p1")}
                        <b>{t("faqs.questions.q9.answer.p2")}</b>
                        {t("faqs.questions.q9.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q9.answer.p4")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 9}
                      index={9}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q10.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 9}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q10.answer.p1")}
                        <b>{t("faqs.questions.q10.answer.p2")}</b>
                        {t("faqs.questions.q10.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q10.answer.p4")}
                      </p>
                      
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 10}
                      index={10}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q11.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 10}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                      textAlign: window.innerWidth <= 384 ? "left":"left",
                      padding: window.innerWidth <= 384 ? 1:"",
                      marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p1")}
                        <b>{t("faqs.questions.q11.answer.p2")}</b>
                        {t("faqs.questions.q11.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q11.answer.p5")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q11.answer.p6")}</li>
                        <li>{t("faqs.questions.q11.answer.p7")}</li>
                        <li>{t("faqs.questions.q11.answer.p8")}</li>
                      </p>
                      
                        
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 11}
                      index={11}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q12.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 11}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q12.answer.p1")}
                        <b>{t("faqs.questions.q12.answer.p2")}</b>
                        {t("faqs.questions.q12.answer.p3")}
                      </p>
                      
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 12}
                      index={12}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q13.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 12}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q13.answer.p3")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                  
                    <Accordion.Title
                      active={activeIndex === 13}
                      index={13}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q14.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 13}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q14.answer.p1")}
                        <b>{t("faqs.questions.q14.answer.p2")}</b>
                        {t("faqs.questions.q14.answer.p3")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q14.answer.p4")}</li>
                        <li>{t("faqs.questions.q14.answer.p5")}</li>
                        <li>{t("faqs.questions.q14.answer.p6")}</li>
                        <li>{t("faqs.questions.q14.answer.p7")}
                          <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q14.answer.p8")}
                      </a>
                        </li>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 14}
                      index={14}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q15.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 14}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q15.answer.p1")}</li>
                        <li>{t("faqs.questions.q15.answer.p2")}</li>
                        <li>{t("faqs.questions.q15.answer.p3")}</li>
                        <li>{t("faqs.questions.q15.answer.p4")}</li>
                        <li>{t("faqs.questions.q15.answer.p5")}</li>
                        <li>{t("faqs.questions.q15.answer.p6")}</li>
                        <li>{t("faqs.questions.q15.answer.p7")}</li>
                        <li>{t("faqs.questions.q15.answer.p8")}</li>
                        <li>{t("faqs.questions.q15.answer.p9")}</li>
                        <li>{t("faqs.questions.q15.answer.p10")}</li>
                        <li>{t("faqs.questions.q15.answer.p11")}</li>
                        <li>{t("faqs.questions.q15.answer.p12")}</li>
                        <li>{t("faqs.questions.q15.answer.p13")}</li>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 15}
                      index={15}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q16.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 15}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p2")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p4")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p5")}
                        <b>{t("faqs.questions.q16.answer.acronym2")}</b>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p6")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p7")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p8")}
                        <b>{t("faqs.questions.q16.answer.acronym1")}</b>
                        {t("faqs.questions.q16.answer.p9")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q16.answer.p10")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 16}
                      index={16}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q17.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 16}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q17.answer.p1")}</li>
                        <li>{t("faqs.questions.q17.answer.p2")}</li>
                        <li>{t("faqs.questions.q17.answer.p3")}</li>
                        <li>{t("faqs.questions.q17.answer.p4")}</li>
                        <li>{t("faqs.questions.q17.answer.p5")}</li>
                        <li>{t("faqs.questions.q17.answer.p6")}</li>
                        <li>{t("faqs.questions.q17.answer.p7")}</li>
                        <li>{t("faqs.questions.q17.answer.p8")}</li>
                        <li>{t("faqs.questions.q17.answer.p9")}</li>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 17}
                      index={17}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q18.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 17}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q18.answer.p1")}
                        <a href="https://www.dollarbtc.com/" target="_blank" rel="noopener noreferrer">
                          {t("faqs.questions.q18.answer.link")}
                        </a>
                        {t("faqs.questions.q18.answer.p2")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 18}
                      index={18}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q19.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 18}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q19.answer.p1")}</li>
                        <li>{t("faqs.questions.q19.answer.p2")}</li>
                        <li>
                          {t("faqs.questions.q19.answer.p3")}
                          <i>{t("faqs.questions.q19.answer.p4")}</i>
                          {t("faqs.questions.q19.answer.p5")}
                       </li>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 19}
                      index={19}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q20.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 19}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q20.answer.p1")}</li>
                        <li>{t("faqs.questions.q20.answer.p2")}</li>
                        <li>
                          {t("faqs.questions.q20.answer.p3")}
                        <b>{t("faqs.questions.q20.answer.p4")}</b>
                          {t("faqs.questions.q20.answer.p5")}
                        </li>
                        <li>{t("faqs.questions.q20.answer.p6")}</li>
                        <li>{t("faqs.questions.q20.answer.p7")}</li>
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q20.answer.p8")}</u>
                        {t("faqs.questions.q20.answer.p9")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 20}
                      index={20}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q21.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 20}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q21.answer.p1")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 21}
                      index={21}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q22.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 21}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q22.answer.p1")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                  
                    <Accordion.Title
                      active={activeIndex === 22}
                      index={22}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q23.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 22}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q23.answer.p4")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 23}
                      index={23}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q24.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 23}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q24.answer.p1")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 24}
                      index={24}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q25.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 24}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q25.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q25.answer.p2")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 25}
                      index={25}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q26.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 25}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q26.answer.p3")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 26}
                      index={26}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q27.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 26}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p3")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q27.answer.p5")}
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 27}
                      index={27}
                      onClick={this.handleClick.bind(this)}
                    >
                       <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q28.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 27}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5",marginLeft: 40 }} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p1")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p2")}
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q28.answer.p3")}</u>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p4")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p5")}
                      </p>
                      <p className="faqs-content">
                        <b>{t("faqs.questions.q28.answer.p6")}</b>
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p7")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p8")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p9")}
                      </p>
                      <p className="faqs-content">
                        {t("faqs.questions.q28.answer.p10")}
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q28.answer.p11")}</li>
                        <li>{t("faqs.questions.q28.answer.p12")}</li>
                        <li>{t("faqs.questions.q28.answer.p13")}</li>
                        <li>{t("faqs.questions.q28.answer.p14")}</li>
                        <li>{t("faqs.questions.q28.answer.p15")}</li>
                      </p>
                      <p className="faqs-content">
                        <u>{t("faqs.questions.q28.answer.p16")}</u>
                      </p>
                      <p className="bleeding">
                        <li>{t("faqs.questions.q28.answer.p17")}</li>
                        <li>{t("faqs.questions.q28.answer.p18")}</li>
                        <li>{t("faqs.questions.q28.answer.p19")}</li>
                        <li>{t("faqs.questions.q28.answer.p20")}</li>
                        <li>{t("faqs.questions.q28.answer.p21")}</li>
                        <li>{t("faqs.questions.q28.answer.p22")}</li>
                      </p>
                    </Accordion.Content>
                    </Accordion> 
                      <Divider hidden></Divider>
                  <Accordion fluid styled style={{ backgroundColor:"#F0F0F0" }}
                  >  
                    <Accordion.Title
                      active={activeIndex === 28}
                      index={28}
                      onClick={this.handleClick.bind(this)}
                    >
                      <Grid columns={3}>
                    <Grid.Column largeScreen={13} mobile={13} tablet={13} computer={13}>
                      <p className="faqs-title">
                        {t("faqs.questions.q29.title")}
                      </p>
                      </Grid.Column> 
                      <Grid.Column largeScreen={2} mobile={2} tablet={2} computer={2}>
                      <Icon name="chevron down" size="large"/>
                      </Grid.Column> 
                      </Grid>
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === 28}
                      style= {{width: window.innerWidth <= 384 ? 220:"",
                              textAlign: window.innerWidth <= 384 ? "left":"left",
                              padding: window.innerWidth <= 384 ? 1:"",
                              marginLeft: window.innerWidth <= 384 ? -30:""}}
                    >
                       <hr style={{ borderColor:"#A5A5A5" ,marginLeft: 40}} ></hr>
                      <p className="faqs-content">
                        {t("faqs.questions.q29.answer.p1")}
                      </p>
                    </Accordion.Content>
                  </Accordion>
                </Container>
            </Container>
          </Grid.Column>
        </Grid>
      </Container>
        </Responsive>
       </div>
    );
  }
}
export default translate(Faqs);
