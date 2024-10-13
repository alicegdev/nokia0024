import { View } from "react-native";
import { color } from "src/styles";

interface BallProps {
    posX: number;
    posY: number;
  }

  const Ball: React.FC<BallProps> = ({ posX, posY }) => {
    return (
      <View style={{
        position: 'absolute',
        left: posX,
        top: posY,
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: color.relief,
      }} />
    );
  };

  export default Ball