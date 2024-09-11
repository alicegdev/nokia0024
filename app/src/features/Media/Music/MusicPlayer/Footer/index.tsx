import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAudioContext } from 'src/contexts/AudioContext';
import { color, spacing } from 'src/styles';

const MusicPlayerFooter = () => {
    const { playSound, pauseSound, rewindSound, currentTrack, isPlaying } = useAudioContext();

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSound();
        } else {
            if (currentTrack?.uri) {
                playSound(currentTrack.uri);
            }
        }
    };

    const handleRewind = () => {
        rewindSound();
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: spacing.md, backgroundColor: color.relief }}>
            <TouchableOpacity onPress={handleRewind}>
                <FontAwesome name="backward" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause}>
                <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ color: 'white' }}>{currentTrack?.filename}</Text>
        </View>
    );
};

export default MusicPlayerFooter;
