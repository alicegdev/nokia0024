import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, Image, Text, TouchableOpacity, View, Animated } from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [latestPhoto, setLatestPhoto] = useState<string | null>(null);
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const navigation: any = useNavigation();

  useEffect(() => {
    async function fetchLatestPhoto() {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const album = await MediaLibrary.getAssetsAsync({
            mediaType: 'photo',
            first: 1,
          });
          if (album.assets.length > 0) {
            setLatestPhoto(album.assets[0].uri);
          }
        }
      } catch (error) {
        console.error("Error loading the latest photo:", error);
      }
    }

    fetchLatestPhoto();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    const options = { quality: 0.5, base64: false };
    const photo = await cameraRef.current?.takePictureAsync(options);
    if (photo) {
      try {
        setOverlayVisible(true);
        Animated.sequence([
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => setOverlayVisible(false));

        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        setLatestPhoto(asset.uri);
      } catch (e) {
        console.error('Error saving photo', e);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gallery')}>
            {latestPhoto ? (
              <Image
                source={{ uri: latestPhoto }}
                style={styles.previewImage}
              />
            ) : (
              <Text style={styles.text}>x</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>o</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>↻</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {/* Black screen overlay for animation */}
      {isOverlayVisible && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        />
      )}
    </View>
  );
};

export default CameraScreen;
