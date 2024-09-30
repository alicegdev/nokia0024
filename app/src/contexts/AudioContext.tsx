import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Audio } from 'expo-av';
import useMusicFiles from 'src/hooks/useMusicFiles';

interface Track {
  uri: string;
  filename: string;
}

interface AudioContextType {
  playSound: (track: Track) => Promise<void>;
  pauseSound: () => Promise<void>;
  rewindSound: () => Promise<void>;
  nextSound: () => Promise<void>;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const { musicFiles, loading } = useMusicFiles(); // Fetch the music files
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (musicFiles.length > 0) {
      const mappedFiles = musicFiles
        .map(file => ({
          uri: file.uri,
          filename: file.filename,
        }))
        .sort((a, b) => a.filename.toLowerCase().localeCompare(b.filename.toLowerCase())); // Sort alphabetically
      setPlaylist(mappedFiles);
    }
  }, [musicFiles]);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const playSound = async (track: Track) => {
    if (sound && currentTrack?.uri === track.uri) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.uri }, { shouldPlay: true });
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
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

  const nextSound = async () => {
    if (playlist.length === 0 || !currentTrack) {
      console.error('Playlist is empty or no current track.');
      return;
    }

    const currentIndex = playlist.findIndex(track => track.uri === currentTrack.uri);

    if (currentIndex === -1) {
      console.error('Current track not found in playlist.');
      return;
    }

    const nextIndex = (currentIndex + 1) % playlist.length;

    if (playlist[nextIndex]) {
      setTrackIndex(nextIndex);
      await playSound(playlist[nextIndex]);
    } else {
      console.error('No track found at the calculated next index.');
    }
};

  return (
    <AudioContext.Provider value={{ playSound, pauseSound, rewindSound, nextSound, currentTrack, isPlaying }}>
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
