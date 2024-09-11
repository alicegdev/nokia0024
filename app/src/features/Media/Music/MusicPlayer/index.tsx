import useMusicFiles from 'src/hooks/useMusicFiles';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAudioContext } from 'src/contexts/AudioContext';

const MusicPlayer = () => {
    const { musicFiles, loading } = useMusicFiles();
    const { playSound } = useAudioContext();

    const handlePress = async (uri: string) => {
        playSound(uri);
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            {musicFiles.map((file, index) => (
                <TouchableOpacity key={index} onPress={() => handlePress(file.uri)}>
                    <View>
                        <Text>{file.filename.replace(/\.mp3$/, '')}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default MusicPlayer