// @flow

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { LanguageDisplay, LanguageDropdown } from "./components";
import { GlobalProvider } from "./context/global";

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <GlobalProvider>
          <LanguageDropdown />
          <LanguageDisplay />
        </GlobalProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
