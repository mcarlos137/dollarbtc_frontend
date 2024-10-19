import PropTypes from "prop-types";
import React, { Component } from "react";
import _ from "lodash";
import {
  Icon,
  Responsive,
  Search,
  Menu,
  Dropdown,
  Feed
} from "semantic-ui-react";
import translate from "../../../i18n/translate";

const resultRenderer = ({ id, date, title, body }) => (
  <a href={"#" + date}>
    <Feed>
      <Feed.Event>
        <Feed.Content>
          <Feed.Summary>
            <a href={"#" + date}>{title}</a>
            <Feed.Date>{new Date(date).toLocaleDateString()}</Feed.Date>
            <Feed.Extra>
              <p>{body}</p>
            </Feed.Extra>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  </a>
);

resultRenderer.propTypes = {
  id: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string
};

class ForumMenuVertical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      value: "",
      source: [],
      updatesearchingdata: this.props.updatesearchingdata,
      positionMenuVertical: true,
      activeItem: "optionAll",
      translator: props.translate
    };
    this.resetComponent = this.resetComponent.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.setData = this.setData.bind(this);
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.language !== nextProps.language) {
      this.setState({
        translator: nextProps.translate
      });
    }
  }
  componentDidMount() {
    if (window.innerWidth <= 768) {
      this.setState({
        positionMenuVertical: false,
        activeItem: this.state.activeItem
      });
    } else {
      this.setState({
        positionMenuVertical: true,
        activeItem: this.state.activeItem
      });
    }
    if (window.innerWidth < 768) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch)
      });
    }, 300);
  };

  setData = posts => {
    this.setState({ source: posts });
  };

  handleChangeScreen(e, data) {
    if (data.width <= 768) {
      this.setState({
        positionMenuVertical: false,
        activeItem: this.state.activeItem
      });
    } else {
      this.setState({
        positionMenuVertical: true,
        activeItem: this.state.activeItem
      });
    }
    if (data.width < 768) {
      this.setState({ miniMenu: true, activeItem: this.state.activeItem });
    } else {
      this.setState({ miniMenu: false, activeItem: this.state.activeItem });
    }
  }
  render() {
    let t = this.state.translator;
    const {
      onclickcategory,
      activecategoryitem,
      categories,
      posts
    } = this.props;
    const { isLoading, value, results } = this.state;
    const setPosts = () => {
      this.setData(posts);
    };
    const regions = categories.filter(c => c.type === "regions");
    const forumsTopics = categories.filter(c => c.type === "forums");

    let menu;
    if (!this.state.miniMenu) {
      menu = (
        <Menu vertical>
          <Menu.Menu>
            <Menu.Item>
              <Search
                loading={isLoading}
                icon="search"
                placeholder={t("forum.menu.vertical.placeholderSearch")}
                type="text"
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                  leading: true
                })}
                results={results}
                value={value}
                noResultsMessage={t("forum.menu.vertical.notResults")}
                onFocus={setPosts}
                resultRenderer={resultRenderer}
                {...this.props}
              />
            </Menu.Item>
          </Menu.Menu>
          <Menu.Item>
            <Menu.Header>{t("forum.menu.vertical.forumHeader")}</Menu.Header>
            <Menu.Menu>
              <Menu.Item
                name=""
                content={t("forum.menu.all")}
                onClick={onclickcategory}
                active={activecategoryitem === ""}
              />
              {forumsTopics.map(category => (
                <Menu.Item
                  key={category.id}
                  name={category.key}
                  content={category.name}
                  onClick={onclickcategory}
                  active={activecategoryitem === category.key}
                />
              ))}
            </Menu.Menu>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>{t("forum.menu.vertical.regionsHeader")}</Menu.Header>
            <Menu.Menu>
              {regions.map(category => (
                <Menu.Item
                  key={category.id}
                  name={category.key}
                  content={category.name}
                  onClick={onclickcategory}
                  active={activecategoryitem === category.key}
                />
              ))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      );
    } else {
      menu = (
        <Dropdown
          fluid
          selection
          text={t("forum.menu.categories")}
          style={{
            color: "#207ef2",
            borderColor: "#207ef2",
            textAlign: "center",
            textTransform: "uppercase",
            borderRadius: 40
          }}
        >
          <Dropdown.Menu
            position="center"
            size="medium"
            style={{ color: "#207ef2", borderColor: "#207ef2" }}
          >
            <Dropdown.Header>
              {t("forum.menu.vertical.forumHeader")}
            </Dropdown.Header>
            <Dropdown.Item
              name=""
              content={t("forum.menu.all")}
              onClick={onclickcategory}
              active={activecategoryitem === ""}
            />
            {forumsTopics.map(category => (
              <Dropdown.Item
                key={category.id}
                name={category.key}
                content={category.name}
                onClick={onclickcategory}
                active={activecategoryitem === category.key}
              />
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>
              {t("forum.menu.vertical.regionsHeader")}
            </Dropdown.Header>
            {regions.map(category => (
              <Dropdown.Item
                key={category.id}
                name={category.key}
                content={category.name}
                onClick={onclickcategory}
                active={activecategoryitem === category.key}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return (
      <Responsive onUpdate={this.handleChangeScreen.bind(this)}>
        {menu}
      </Responsive>
    );
  }
}

export default translate(ForumMenuVertical);
