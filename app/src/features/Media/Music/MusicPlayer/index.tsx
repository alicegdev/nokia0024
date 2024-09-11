import useMusicFiles from 'src/hooks/useMusicFiles';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAudioContext } from 'src/contexts/AudioContext';
import styles from './styles';
import { color } from 'src/styles';

const MusicPlayer = () => {
    const { musicFiles, loading } = useMusicFiles();
    const { playSound } = useAudioContext();

    const handlePress = async (uri: string, filename: string) => {
        playSound(uri, filename);
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const sortedMusicFiles = musicFiles.sort((a, b) => {
        const filenameA = a.filename.replace(/\.mp3$/, '').toLowerCase();
        const filenameB = b.filename.replace(/\.mp3$/, '').toLowerCase();
        return filenameA.localeCompare(filenameB);
    });

    return (
        <ScrollView>
            {sortedMusicFiles.map((file, index) => (
                <TouchableOpacity key={index} onPress={() => handlePress(file.uri, file.filename)}>
                    <View style={styles.list}>
                        <Text style={styles.textList}>{file.filename.replace(/\.mp3$/, '')}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default MusicPlayer;
