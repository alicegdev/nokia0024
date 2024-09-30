import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAudioContext } from 'src/contexts/AudioContext';
import styles from './styles';
import Track from '../Track'; 

const MusicPlayerFooter = () => {
    const { playSound, pauseSound, rewindSound, currentTrack, isPlaying } = useAudioContext();
    const [isModalVisible, setModalVisible] = useState(false);

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseSound();
        } else {
            if (currentTrack?.uri && currentTrack.filename) {
                playSound(currentTrack);
            }
        }
    };

    const handleRewind = () => {
        rewindSound();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <>
            <TouchableOpacity style={styles.main} onPress={toggleModal}>
                <TouchableOpacity onPress={handleRewind}>
                    <FontAwesome name="backward" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause}>
                    <FontAwesome name={isPlaying ? "pause" : "play"} size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.textList}>{currentTrack?.filename.replace(/\.mp3$/, '')}</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <Track onClose={toggleModal} />
            </Modal>
        </>
    );
};

export default MusicPlayerFooter;
