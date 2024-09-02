import React, { View, ViewProps } from "react-native";
import { Children, cloneElement, isValidElement } from "react";

import { UIFC } from "../types";

import styles from "./styles";

export const Screen: UIFC<ViewProps> = ({ children, style, ...viewProps }) => {
  const arrayChildren = Children.toArray(children);
  const validChildren = arrayChildren.filter((child) => isValidElement(child));

  return (
    <View style={[styles.root, style]} {...viewProps}>
      {Children.map(validChildren, (child, index) => {
        if (!isValidElement(child)) return null;

        return cloneElement(child, {
          ...child.props,
          style: {
            ...(index !== 0 ? styles.notFirstChild : {}),
            ...child.props.style,
          },
        });
      })}
    </View>
  );
};
