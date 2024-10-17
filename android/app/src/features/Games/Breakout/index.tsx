import React, { useState, useRef, useEffect } from "react";
import { View, Text, PanResponder, Dimensions } from "react-native";
import GameModal from "../Scores/GameModal";
import Header from "../SnakeIII/Header";
import Paddle from "./Components/Paddle";
import Ball from "./Components/Ball";
import Brick from "./Components/Brick";
import styles from "./styles";
import SpaceBlastStage from "./Components/SpaceBlastStage";

type Brick = {
  posX: number;
  posY: number;
  width: number;
  height: number;
  isVisible: boolean;
};

const screenWidth = 400;
const screenHeight = 780;
const rightBorderReduction = 12;
const paddleWidth = 100;
const ballSize = 15;
const brickWidth = 50;
const brickHeight = 20;
const numBricksPerRow = Math.floor(
  (screenWidth - rightBorderReduction) / (brickWidth + 10),
);

const initBricks = (levelRow: number) => {
  const totalBrickWidth = numBricksPerRow * brickWidth;
  const totalSpacing = screenWidth - rightBorderReduction - totalBrickWidth;
  const spacingBetweenBricks = totalSpacing / (numBricksPerRow + 1);

  let bricks = [];
  for (let row = 0; row < levelRow; row++) {
    for (let col = 0; col < numBricksPerRow; col++) {
      bricks.push({
        posX: spacingBetweenBricks + col * (brickWidth + spacingBetweenBricks),
        posY: 10 + row * (brickHeight + 10),
        width: brickWidth,
        height: brickHeight,
        isVisible: true,
      });
    }
  }
  return bricks;
};

type ActiveStage = "" | "second" | "third" | "win";

const Breakout: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNextLevel, setIsNextLevel] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [activeStage, setActiveStage] = useState<ActiveStage>("");

  const [ballPosition, setBallPosition] = useState({
    x: screenWidth / 2 - ballSize / 2,
    y: screenHeight / 2 - ballSize / 2,
  });
  const [ballVelocity, setBallVelocity] = useState({ vx: 10, vy: -10 });
  const [paddlePosition, setPaddlePosition] = useState(
    screenWidth / 2 - paddleWidth / 2,
  );
  const [bricks, setBricks] = useState(initBricks(2));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setIsPaused(false);
        let newPosX = gestureState.moveX - paddleWidth / 2;
        newPosX = Math.max(
          0,
          Math.min(screenWidth - rightBorderReduction - paddleWidth, newPosX),
        );
        setPaddlePosition(newPosX);
      },
    }),
  ).current;

  useEffect(() => {
    let interval = setInterval(() => {
      if (isGameOver) {
        handleGameOver();
      }
      if (!isPaused && !isGameOver) {
        let newPosX = ballPosition.x + ballVelocity.vx;
        let newPosY = ballPosition.y + ballVelocity.vy;

        if (
          newPosX <= 0 ||
          newPosX >= screenWidth - rightBorderReduction - ballSize
        ) {
          setBallVelocity((prev) => ({ ...prev, vx: -prev.vx }));
          newPosX = Math.max(
            0,
            Math.min(screenWidth - rightBorderReduction - ballSize, newPosX),
          );
        }

        if (newPosY <= 0) {
          setBallVelocity((prev) => ({ ...prev, vy: -prev.vy }));
          newPosY = Math.max(0, newPosY);
        } else if (newPosY + ballSize >= screenHeight - 40) {
          if (
            newPosY + ballSize >= screenHeight - 40 &&
            newPosX + ballSize >= paddlePosition &&
            newPosX <= paddlePosition + paddleWidth
          ) {
            const paddleCenter = paddlePosition + paddleWidth / 2;
            const ballCenter = newPosX + ballSize / 2;
            if (ballCenter < paddleCenter) {
              setBallVelocity((prev) => ({
                vx: -Math.abs(prev.vx),
                vy: -Math.abs(prev.vy),
              }));
            } else {
              setBallVelocity((prev) => ({
                vx: Math.abs(prev.vx),
                vy: -Math.abs(prev.vy),
              }));
            }
            newPosY = screenHeight - 40 - ballSize;
          } else {
            setIsGameOver(true);
          }
        }

        setBallPosition({ x: newPosX, y: newPosY });

        let updatedBricks = bricks.map((brick) => {
          if (
            brick.isVisible &&
            newPosY <= brick.posY + brick.height &&
            newPosY + ballSize >= brick.posY &&
            newPosX + ballSize >= brick.posX &&
            newPosX <= brick.posX + brick.width
          ) {
            setScore((prevScore) => prevScore + 10);
            setBallVelocity((prev) => ({ ...prev, vy: -prev.vy }));
            return { ...brick, isVisible: false };
          }
          return brick;
        });

        setBricks(updatedBricks);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [ballPosition, ballVelocity, isPaused, paddlePosition, bricks]);

  useEffect(() => {
    const allBricksDestroyed = bricks.every((brick) => !brick.isVisible);
    if (allBricksDestroyed) {
      if (activeStage === "") {
        setActiveStage("second");
        setIsPaused(true);
        setIsNextLevel(true);
      } else if (activeStage === "second") {
        setActiveStage("third");
        setIsPaused(true);
        setIsNextLevel(true);
      } else if (activeStage === "third") {
        setActiveStage("win");
        setIsPaused(true);
        setIsNextLevel(true);
      }
    }
  }, [bricks]);

  const handleModal = () => {
    setIsVisible(false);
  };

  const handleStageModal = () => {
    setIsNextLevel(false);
  };

  const handleGameOver = () => {
    setIsVisible(true);
    setFinalScore(score);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  const reloadGame = () => {
    setPaddlePosition(screenWidth / 2 - paddleWidth / 2);
    setBallPosition({
      x: screenWidth / 2 - ballSize / 2,
      y: screenHeight / 2 - ballSize / 2,
    });
    setBallVelocity({ vx: 10, vy: -10 });
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
    setBricks(initBricks(2));
  };

  const secondStage = () => {
    setPaddlePosition(screenWidth / 2 - paddleWidth / 2);
    setBallPosition({
      x: screenWidth / 2 - ballSize / 2,
      y: screenHeight / 2 - ballSize / 2,
    });
    setBallVelocity({ vx: 13, vy: -13 });
    setBricks(initBricks(3));
  };

  const thirdStage = () => {
    setPaddlePosition(screenWidth / 2 - paddleWidth / 2);
    setBallPosition({
      x: screenWidth / 2 - ballSize / 2,
      y: screenHeight / 2 - ballSize / 2,
    });
    setBallVelocity({ vx: 16, vy: -16 });
    setIsPaused(true);
    setBricks(initBricks(4));
  };

  return (
    <>
      {isVisible ? (
        <GameModal
          game={3}
          gameName="Breakout"
          score={finalScore}
          isGameOver={isGameOver}
          onEvent={handleModal}
          reloadGame={reloadGame}
        />
      ) : (
        <View style={styles.container}>
          <Header
            pauseGame={pauseGame}
            reloadGame={reloadGame}
            isPaused={isPaused}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{score}</Text>
          </Header>
          <View style={styles.gameArea} {...panResponder.panHandlers}>
            <Paddle posX={paddlePosition} />
            <Ball posX={ballPosition.x} posY={ballPosition.y} />
            {bricks.map((brick, index) => (
              <Brick
                key={index}
                posX={brick.posX}
                posY={brick.posY}
                width={brick.width}
                height={brick.height}
                isVisible={brick.isVisible}
              />
            ))}
          </View>
        </View>
      )}
      {isNextLevel ? (
        <SpaceBlastStage
          onEvent={handleStageModal}
          secondStage={secondStage}
          thirdStage={thirdStage}
          activeStage={activeStage}
        ></SpaceBlastStage>
      ) : null}
    </>
  );
};

export default Breakout;
