import { View } from "react-native";
import { color } from "src/styles";

interface BrickProps {
    posX: number;
    posY: number;
    width: number;
    height: number;
    isVisible: boolean;
  }

const Brick: React.FC<BrickProps> = ({ posX, posY, width, height, isVisible }) => {
    if (!isVisible) return null;
    return (
      <View style={{
        position: 'absolute',
        left: posX,
        top: posY,
        width,
        height,
        backgroundColor: color.relief,
        borderWidth: 1,
        borderColor: 'black',
      }} />
    );
  };
export default Brick
