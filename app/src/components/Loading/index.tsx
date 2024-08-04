import React, { ActivityIndicator } from "react-native";

import { Screen } from "../Screen";
import { UIFC } from "../types";

import styles from "./styles";
import { color } from "../../styles";

export const Loading: UIFC = ({ style }) => (
  <Screen style={[styles.root, style]}>
    <ActivityIndicator size="large" color={color.menu} />
  </Screen>
);