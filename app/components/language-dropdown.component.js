// @flow
import React from "react";
import { ConnectGlobal, selectLanguage } from "../context/global";
import ModalDropdown from "react-native-modal-dropdown";
import _ from "lodash";

type Props = {
  language: string,
  changeLanguage: Function,
  strings: any
};

class LanguageDropdown extends React.Component<Props> {
  toggleLanguage = language => {
    this.props.changeLanguage(language);
  };

  render() {
    const languageList = _.values(this.props.strings.languages);
    return (
      <ModalDropdown
        options={languageList}
        onSelect={index => this.toggleLanguage(index)}
      />
    );
  }
}

const mapContextToProps = context => {
  return {
    language: context.language,
    strings: context.strings
  };
};

const mapActionsToProps = dispatch => {
  return {
    changeLanguage: languageIndex => dispatch(selectLanguage(languageIndex))
  };
};

export default ConnectGlobal(mapContextToProps, mapActionsToProps)(
  LanguageDropdown
);
