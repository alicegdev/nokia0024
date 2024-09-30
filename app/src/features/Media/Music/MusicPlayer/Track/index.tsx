import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { useAudioContext } from 'src/contexts/AudioContext';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

type TrackProps = {
    onClose: () => void;
};

const Track: React.FC<TrackProps> = ({ onClose }) => {
    const { playSound, pauseSound, rewindSound, nextSound, seekSound, playbackDuration, playbackDurationMillis, playbackPositionMillis, playbackPosition, currentTrack, isPlaying } = useAudioContext();

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSound();
        } else {
            if (currentTrack) {
                playSound(currentTrack);
            }
        }
    };
    const handleSeek = (value: number) => {
        seekSound(value);
    };

    return (
        <View style={styles.modalContainer}>
            {currentTrack && (
                <View style={styles.track}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>x</Text>
                    </TouchableOpacity>
                    <Text style={styles.trackTitle}>{currentTrack.filename.replace(/\.mp3$/, '')}</Text>
                    <Text style={styles.trackTime}>{playbackPosition} : {playbackDuration}</Text>
                    <Slider
                        style={{ width: 240, height: 40 }}
                        minimumValue={0}
                        maximumValue={playbackDurationMillis}
                        value={playbackPositionMillis}
                        onSlidingComplete={handleSeek}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                    <View style={styles.playerControls}>
                        <TouchableOpacity onPress={rewindSound}>
                            <FontAwesome name="backward" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePlayPause()}>
                            <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextSound}>
                            <FontAwesome name="forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Track;
