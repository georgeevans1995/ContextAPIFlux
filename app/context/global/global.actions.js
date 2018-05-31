// @flow
import { languages } from "./global.context";
import strings from "./translations";

export const selectLanguage = (languageIndex: number) => {
  return {
    type: "SELECT_LANGUAGE",
    language: languages[languageIndex],
    strings: strings[languages[languageIndex]]
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: "SET_LOADING",
    loading: loading
  };
};
