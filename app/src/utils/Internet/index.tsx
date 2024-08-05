import { Linking } from 'react-native';

export const Internet = (url) => {
  Linking.openURL(url).catch(err => console.error("Failed to open URL: ", err));
};
