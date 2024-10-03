import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface HighScoresProps {
  game: string;
}

const HighScoresScreen = ({ game }: HighScoresProps) => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const response = await axios.get('http://51.158.69.60:5050/scores');
      setScores(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const renderItem = ({ item }: { item: { name: string; score: number } }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{game}</Text>
      <Text style={styles.title}>High Scores</Text>
      <FlatList data={scores} renderItem={renderItem} keyExtractor={item => item.name} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
});

export default HighScoresScreen;
