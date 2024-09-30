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
  seekSound: (positionMillis: number) => Promise<void>;
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackPosition: string; // Formatted time for display
  playbackPositionMillis: number; // Milliseconds for functional use
  playbackDuration: string; // Formatted time for display
  playbackDurationMillis: number; // Milliseconds for functional use
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

const formatTime = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const { musicFiles, loading } = useMusicFiles();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState('0:00');
  const [playbackPositionMillis, setPlaybackPositionMillis] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState('0:00');
  const [playbackDurationMillis, setPlaybackDurationMillis] = useState(0);

  useEffect(() => {
    if (musicFiles.length > 0) {
      const mappedFiles = musicFiles.map(file => ({
        uri: file.uri,
        filename: file.filename,
      })).sort((a, b) => a.filename.toLowerCase().localeCompare(b.filename.toLowerCase()));
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
    const currentIndex = playlist.findIndex(track => track.uri === currentTrack?.uri);
    const previousIndex = currentIndex - 1;
    if (sound && playbackPositionMillis > 1000 || previousIndex < 0) {
      await sound?.setPositionAsync(0);
      if (!isPlaying) {
        await sound?.playAsync();
      }
    } else {
        if (currentIndex === -1 || playlist.length === 0) {
        return;
        }
        await playSound(playlist[previousIndex]);
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
      console.error('No track found.');
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        console.log(`Playback error: ${playbackStatus.error}`);
      }
    } else {
      if (playbackStatus.isPlaying) {
        setPlaybackPosition(formatTime(playbackStatus.positionMillis));
        setPlaybackPositionMillis(playbackStatus.positionMillis);
        setPlaybackDuration(formatTime(playbackStatus.durationMillis));
        setPlaybackDurationMillis(playbackStatus.durationMillis);
      }
      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        const currentIndex = playlist.findIndex(track => track.uri === currentTrack?.uri);
        const nextIndex = (currentIndex + 1) % playlist.length;
        if (currentIndex !== -1) {
          playSound(playlist[nextIndex]).catch(console.error);
        }
      }
    }
  };
  
  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [sound, playlist, currentTrack]);
  

  const seekSound = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis);
      setPlaybackPosition(formatTime(positionMillis));
      setPlaybackPositionMillis(positionMillis);
    }
  };

  return (
    <AudioContext.Provider value={{
        playSound,
        pauseSound,
        rewindSound,
        nextSound,
        currentTrack,
        isPlaying,
        seekSound,
        playbackPosition,
        playbackPositionMillis,
        playbackDuration,
        playbackDurationMillis
      }}>
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
