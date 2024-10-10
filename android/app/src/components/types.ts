import { FC } from "react";
import { StyleProp, ViewStyle } from "react-native";

type finalProps<Props, StyleType> = {
  style?: StyleProp<StyleType>;
} & Props;

export type UIFC<Props = object, StyleType = ViewStyle> = FC<finalProps<Props, StyleType>> & {
  outerHeight?: number;
};
