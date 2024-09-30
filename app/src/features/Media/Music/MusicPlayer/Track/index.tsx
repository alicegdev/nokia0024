import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useAudioContext } from 'src/contexts/AudioContext';
import { FontAwesome } from '@expo/vector-icons';

type TrackProps = {
    onClose: () => void;
};

const Track: React.FC<TrackProps> = ({ onClose }) => {
    const { playSound, pauseSound, rewindSound, nextSound, currentTrack, isPlaying } = useAudioContext();

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSound();
        } else {
            if (currentTrack) {
                playSound(currentTrack);
            }
        }
    };

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            {currentTrack && (
                <View style={styles.track}>
                    <Text style={styles.trackTitle}>Now Playing: {currentTrack.filename}</Text>
                    <TouchableOpacity onPress={rewindSound}>
                         <FontAwesome name="backward" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePlayPause}>
                        <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextSound}>
                         <FontAwesome name="forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Track;
