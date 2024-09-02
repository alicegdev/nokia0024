import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Nokia': require('../assets/fonts/nokia.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;
