// @flow
import * as ActionTypes from "./global.mutations";

export const dispatch = (
  state: {},
  action: { type: string, language: string, loading: boolean, strings: any }
) => {
  switch (action.type) {
    case ActionTypes.SELECT_LANGUAGE:
      return {
        ...state,
        language: action.language,
        strings: action.strings
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
};
