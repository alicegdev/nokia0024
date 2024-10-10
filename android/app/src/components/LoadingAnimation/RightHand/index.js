import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightHand = () => (
  <Svg width="50" height="50" viewBox="0 0 50 50">
    <Path
      d="M35 10 H 45 V 20 H 35 Z M30 5 H 40 V 15 H 30 Z M25 0 H 35 V 10 H 25 Z" // Example path data for a pixelated hand
      fill="#c7f0d8"
    />
  </Svg>
);

export default RightHand;