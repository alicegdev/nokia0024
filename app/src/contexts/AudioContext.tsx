import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface AudioContextType {
    playSound: (uri: string, filename: string) => Promise<void>;
    pauseSound: () => Promise<void>;
    rewindSound: () => Promise<void>;
    currentTrack: { uri?: string, filename?: string } | null;
    isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
    children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentTrack, setCurrentTrack] = useState<{ uri?: string, filename?: string } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            sound?.unloadAsync();
        };
    }, [sound]);

    const playSound = async (uri: string, filename: string) => {
        const cleanFilename = filename.replace(/\.mp3$/, '');
        if (sound && currentTrack?.uri === uri) {
            await sound.playAsync();
            setIsPlaying(true);
        } else {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
            setSound(newSound);
            setCurrentTrack({ uri, filename: cleanFilename });
            setIsPlaying(true);
        }
    };

    const pauseSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
        }
    };

    const rewindSound = async () => {
        if (sound) {
            await sound.setPositionAsync(0);
            if (!isPlaying) {
                await sound.playAsync();
            }
        }
    };

    return (
        <AudioContext.Provider value={{ playSound, pauseSound, rewindSound, currentTrack, isPlaying }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (context === null) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
};
