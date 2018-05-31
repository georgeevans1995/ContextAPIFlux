// @flow
import React from "react";
import { selectLanguage } from "./global.actions";
import strings from "./translations";
export const languages = ["en", "fr_Fr", "es"];

type State = {
  isLoading: boolean,
  language: string,
  +actions: any,
  strings: any
};

let initialState: State = {
  isLoading: false,
  language: languages[0],
  strings: strings.en,
  actions: {
    selectLanguage: languageIndex => {
      selectLanguage(languageIndex);
    }
  }
};

export const GlobalContext = React.createContext(initialState);
