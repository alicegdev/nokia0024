import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

type MediaAsset = MediaLibrary.Asset;

function useMusicFiles() {
  const [musicFiles, setMusicFiles] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);

  async function getPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status;
  }

  async function fetchMusicFiles() {
    const permission = await getPermissions();
    if (permission !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    setLoading(true);
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });

    setLoading(false);
    if (media.totalCount > 0) {
      setMusicFiles(media.assets);
    }
  }

  useEffect(() => {
    fetchMusicFiles();
  }, []);

  return { musicFiles, loading };
}

export default useMusicFiles;
