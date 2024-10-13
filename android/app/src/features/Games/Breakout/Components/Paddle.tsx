import { View } from "react-native";
import { color } from "src/styles";

interface PaddleProps {
    posX: number;
  }

const Paddle: React.FC<PaddleProps> = ({ posX }) => {
    return (
      <View style={{
        position: 'absolute',
        left: posX,
        bottom: 20,
        width: 100,
        height: 20,
        backgroundColor: color.relief,
      }} />
    );
  };

export default Paddle
