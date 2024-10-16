import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Brightness from 'expo-brightness';
import styles from './styles';

const BrightnessSlider: React.FC = () => {
    const [currentBrightness, setCurrentBrightness] = useState<number>(0);

    useEffect(() => {
        const getAndSetInitialBrightness = async () => {
            const { status } = await Brightness.requestPermissionsAsync();
            if (status === 'granted') {
                const brightness = await Brightness.getBrightnessAsync();
                setCurrentBrightness(brightness);
            } else {
                alert("Brightness adjustment requires permission");
            }
        };
        getAndSetInitialBrightness();
    }, []);
    

    const handleBrightnessChangeComplete = async (value: number) => {
        const newBrightness = value / 100;
        await Brightness.setSystemBrightnessAsync(newBrightness);
        setCurrentBrightness(newBrightness);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Adjust Brightness</Text>
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={currentBrightness * 100}
                    onSlidingComplete={handleBrightnessChangeComplete}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
            </View>
            <Text style={styles.text}>{Math.round(currentBrightness * 100)}%</Text>
        </View>
    );
};


export default BrightnessSlider;
