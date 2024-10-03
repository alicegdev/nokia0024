import * as React from "react";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Colors } from "./styles";
import { PanGestureHandler } from "react-native-gesture-handler";
import SnakeComponent from "./SnakeComponent";
import { checkGameOver } from "./utils/checkGameOver";
import Food from "./Food";
import { randomFoodPosition } from "./utils/randomFoodPosition";
import { checkEatsFood } from "./utils/checkEatsFood";
import Header from "./Header";
import { Text } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import axios from "axios";
import GameModal from "../Scores/GameModal";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 70 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

const Directions = {
  right: "right",
  left: "left",
  down: "down",
  up: "up",
};

export default function Snake(): JSX.Element {
  const [direction, setDirection] = useState(Directions.right);
  const [snake, setSnake] = useState(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  //TODO: When button is clicked -> user is redirected to a Score Screen

  const handleModal = () => {
    setIsVisible(false);
  };

  const handleGameOver = () => {
    setIsVisible(true);
    setFinalScore(score);
    return async () => {
      try {
        await axios.post(`http://51.158.69.60:5050/score`);
      } catch (error) {
        console.error(error);
      }
    };
  };

  useEffect(() => {
    if (!isGameOver) {
      const intervalId = setInterval(() => {
        if (!isPaused) {
          moveSnake();
        }
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
    if (isGameOver) {
      handleGameOver();
    }
  }, [snake, isGameOver, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead }; // creating a copy

    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver(true);
      return;
    }

    switch (direction) {
      case "up":
        newHead.y -= 1;
        break;
      case "down":
        newHead.y += 1; // Fix to increment y for moving down
        break;
      case "left":
        newHead.x -= 1; // Fix to decrement x for moving left
        break;
      case "right":
        newHead.x += 1;
        break;
      default:
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
    }
  };

  const handleGesture = (event: {
    nativeEvent: { translationX: any; translationY: any };
  }) => {
    const { translationX, translationY } = event.nativeEvent;
  
    setIsPaused(false);
  
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Directions.right);
      } else {
        setDirection(Directions.left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Directions.down);
      } else {
        setDirection(Directions.up);
      }
    }
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Directions.right);
    setIsPaused(true);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  return (
    <>
      {isVisible ? (
        <GameModal
          game={"Snake III"}
          gameDesign={"Snake III"}
          isGameOver={isGameOver}
          onEvent={handleModal}
        />
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
              <Header
                isPaused={isPaused}
                pauseGame={pauseGame}
                reloadGame={reloadGame}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: Colors.primary,
                  }}
                >
                  {score}
                </Text>
              </Header>
              <View style={styles.boundaries}>
                <SnakeComponent snake={snake} />
                <Food x={food.x} y={food.y} />
              </View>
            </SafeAreaView>
          </PanGestureHandler>
        </GestureHandlerRootView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background,
  },
});
