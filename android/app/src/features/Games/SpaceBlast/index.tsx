import React, { useState, useEffect, useRef } from "react";
import { View, Text, PanResponder } from "react-native";
import GameModal from "../Scores/GameModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styles from "./styles";
import Header from "../SnakeIII/Header";
import axios from "axios";

// Define the Missile interface
interface Missile {
  x: number;
  y: number;
}

const SpaceBlast = () => {
  const SHIP_WIDTH = 30;
  const GAME_AREA_WIDTH = 400;
  const SHIP_INITIAL_POSITION = {
    x: GAME_AREA_WIDTH / 2 - SHIP_WIDTH / 2,
    y: 700,
  };
  const NEW_ENEMY_SPAWN_INTERVAL = 200;
  const ENEMY_RESPAWN_Y = 50;

  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shipPosition, setShipPosition] = useState(SHIP_INITIAL_POSITION);
  const shipPositionRef = useRef(shipPosition);
  const [enemies, setEnemies] = useState<{ x: number; y: number }[]>([]);
  const [missiles, setMissiles] = useState<Missile[]>([]);

  const enemySpawnInterval = useRef<NodeJS.Timeout | null>(null);
  const enemyMoveInterval = useRef<NodeJS.Timeout | null>(null);
  const missileMovementInterval = useRef<NodeJS.Timeout | null>(null);
  const shootingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleModal = () => {
    setIsVisible(false);
  };

  const handleGameOver = async () => {
    setIsVisible(true);
    setFinalScore(score);
    try {
      await axios.post(`https://n0kia-0024.com/score`);
    } catch (error) {
      console.error(error);
    }
  };

  const reloadGame = () => {
    setShipPosition(SHIP_INITIAL_POSITION);
    setEnemies([]);
    setMissiles([]);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  const spawnEnemy = () => {
    const x = Math.random() * (GAME_AREA_WIDTH - 30);
    return { x, y: ENEMY_RESPAWN_Y };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Resume the game on touch
        setIsPaused(false);

        // Start shooting missiles
        shootingInterval.current = setInterval(() => {
          setMissiles((missiles) => [
            ...missiles,
            {
              x: shipPositionRef.current.x + SHIP_WIDTH / 2,
              y: shipPositionRef.current.y - 20,
            },
          ]);
        }, 100);
      },
      onPanResponderMove: (e) => {
        const touchX = e.nativeEvent.pageX;
        const newShipX = Math.max(
          0,
          Math.min(touchX - SHIP_WIDTH / 2, GAME_AREA_WIDTH - SHIP_WIDTH)
        );
        setShipPosition((prev) => ({ ...prev, x: newShipX }));
        shipPositionRef.current = { ...shipPosition, x: newShipX };
      },
      onPanResponderRelease: () => {
        // Stop shooting missiles when touch ends
        if (shootingInterval.current) {
          clearInterval(shootingInterval.current);
          shootingInterval.current = null;
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isGameOver) {
      handleGameOver();
    }
  }, [isGameOver]);

  // Spawn enemies at regular intervals
  useEffect(() => {
    if (!isGameOver) {
      enemySpawnInterval.current = setInterval(() => {
        if (!isPaused) {
          setEnemies((prevEnemies) => [...prevEnemies, spawnEnemy()]);
        }
      }, NEW_ENEMY_SPAWN_INTERVAL);
    }

    return () => {
      if (enemySpawnInterval.current) {
        clearInterval(enemySpawnInterval.current);
      }
    };
  }, [isPaused, isGameOver]);

  // Dynamically adjust enemy movement speed based on score
  useEffect(() => {
    if (!isPaused) {
      const moveEnemies = () => {
        setEnemies((prevEnemies) =>
          prevEnemies
            .map((enemy) => ({
              ...enemy,
              y: enemy.y + 10,
            }))
            .filter((enemy) => {
              if (enemy.y > 700) {
                setIsGameOver(true);
                return false;
              }
              return true;
            })
        );
      };

      if (enemyMoveInterval.current) {
        clearInterval(enemyMoveInterval.current);
      }

      enemyMoveInterval.current = setInterval(
        moveEnemies,
        score > 500 ? 50 : 100
      );

      return () => {
        if (enemyMoveInterval.current) {
          clearInterval(enemyMoveInterval.current);
        }
      };
    }
  }, [score, isGameOver, isPaused]);

  // Move missiles at a regular interval
  useEffect(() => {
    if (!isGameOver) {
      missileMovementInterval.current = setInterval(() => {
        if (!isPaused) {
          setMissiles((missiles) =>
            missiles
              .map((missile) => ({ ...missile, y: missile.y - 20 }))
              .filter((missile) => missile.y > 0)
          );
        }
      }, 1);
    }

    return () => {
      if (missileMovementInterval.current) {
        clearInterval(missileMovementInterval.current);
      }
    };
  }, [isPaused, isGameOver]);

  // Check for collisions between missiles and enemies
  useEffect(() => {
    const newMissiles = missiles.filter(
      (missile) =>
        !enemies.some(
          (enemy) =>
            missile.x >= enemy.x &&
            missile.x <= enemy.x + 30 &&
            missile.y <= enemy.y + 30
        )
    );
    const newEnemies = enemies.filter(
      (enemy) =>
        !missiles.some(
          (missile) =>
            missile.x >= enemy.x &&
            missile.x <= enemy.x + 30 &&
            missile.y <= enemy.y + 30
        )
    );

    if (newEnemies.length !== enemies.length) {
      setScore(score + (enemies.length - newEnemies.length) * 10);
      setEnemies(newEnemies);
      setMissiles(newMissiles);
    }
  }, [missiles, enemies]);

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  return (
    <>
      {isVisible ? (
        <GameModal
          game={2}
          gameName="Space Blast"
          score={finalScore}
          isGameOver={isGameOver}
          onEvent={handleModal}
          reloadGame={reloadGame}
        />
      ) : (
        <GestureHandlerRootView
          style={{ flex: 1 }}
          {...panResponder.panHandlers}
        >
          <View style={styles.container}>
            <Header
              pauseGame={pauseGame}
              reloadGame={reloadGame}
              isPaused={isPaused}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {score}
              </Text>
            </Header>
            <View style={styles.gameArea}>
              <Text
                style={[
                  styles.ship,
                  { left: shipPosition.x, top: shipPosition.y },
                ]}
              >
                o
              </Text>
              {enemies.map((enemy, index) => (
                <Text
                  key={index}
                  style={[styles.enemy, { left: enemy.x, top: enemy.y }]}
                >
                  x
                </Text>
              ))}
              {missiles.map((missile, index) => (
                <Text
                  key={index}
                  style={[styles.missile, { left: missile.x, top: missile.y }]}
                >
                  I
                </Text>
              ))}
            </View>
          </View>
        </GestureHandlerRootView>
      )}
    </>
  );
};

export default SpaceBlast;
