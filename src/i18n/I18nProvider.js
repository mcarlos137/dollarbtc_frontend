import PropTypes from "prop-types";
import Polyglot from 'node-polyglot';

import {compose, withContext, withState, withHandlers, withStateHandlers} from 'recompose';

import messages from "./messages";
import * as React from "react";
import {Dropdown, Icon} from "semantic-ui-react";

let friendOptions = [
  { text: "Inglés", value: "en", disabled: false },
  { text: "Español", value: "es" }
];

const LanguageSelector = ({handleClick})=>{
  return(
    <Dropdown
      id="lengu-select"
      style={{ marginLeft: "10px" }}
      inline
      icon={<Icon name="angle down" inverted />}
      options={friendOptions}
      defaultValue={friendOptions[1].value}
      onChange={handleClick}
    />
  );
};

const withI18nContext = withContext({
  language: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
}, ({ language }) => {
  let polyglot = new Polyglot({
    language,
    phrases: messages[language],
  });
  let translate = polyglot.t.bind(polyglot);
  return { language, translate };
});

const withI18nStateAndHandlers = withStateHandlers(()=>({language: "en"}),{
    handleClick: ({language}) => (event, data) => ({
      language:data.value,
    }),
  });

export const I18nProvider = ({ children }) => React.Children.only(children);

const enhance = compose(withI18nStateAndHandlers, withI18nContext);

export const LangSelect = enhance(LanguageSelector);

export default withI18nContext(I18nProvider);