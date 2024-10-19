import React, {Component} from "react";
import {Menu} from "semantic-ui-react"
import translate from "../../../i18n/translate";

class ForumMenuHorizontal extends Component {
  constructor(props) {
    super(props);
    this.state={
      translator:props.translate
    }
  }
  componentWillReceiveProps(nextProps, nextContext){
    if(this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      })
    }
  }
  render() {
    let t = this.state.translator;
    const { onClickItem, activeItem } = this.props;

    return (
      <Menu pointing>
        <Menu.Item
          name="myfeed"
          content={t("forum.menu.feed")}
          active={activeItem === "myfeed"}
          onClick={onClickItem}
        />
        <Menu.Item
          name="all"
          content={t("forum.menu.all")}
          active={activeItem === "all"}
          onClick={onClickItem}
        />
      </Menu>
    );
  }
}

export default translate(ForumMenuHorizontal);