import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import useMusicFiles from "src/hooks/useMusicFiles";
import { useAudioContext } from "src/contexts/AudioContext";
import styles from "./styles";

const MusicPlayer = () => {
  const { musicFiles, loading } = useMusicFiles();
  const { playSound } = useAudioContext();
  const [searchTerm, setSearchTerm] = useState("");

  const handlePress = async (track: any) => {
    playSound(track);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const filteredMusicFiles = musicFiles
    .filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const filenameA = a.filename.replace(/\.mp3$/, "").toLowerCase();
      const filenameB = b.filename.replace(/\.mp3$/, "").toLowerCase();
      return filenameA.localeCompare(filenameB);
    });

  return (
    <ScrollView>
      <View style={styles.search}>
        <TextInput
          placeholder="Search by name"
          value={searchTerm}
          onChangeText={handleSearch}
          style={styles.searchCore}
        />
      </View>
      {filteredMusicFiles.length > 0 ? (
        filteredMusicFiles.map((file, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(file)}>
            <View style={styles.list}>
              <Text style={styles.textList}>
                {file.filename.replace(/\.mp3$/, "")}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any music</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MusicPlayer;
