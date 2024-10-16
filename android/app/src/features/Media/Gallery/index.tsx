import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-media-library';
import styles from './styles';
import { useIsFocused } from '@react-navigation/native';

const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<Asset[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Asset | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        async function loadPhotos() {
            try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status === 'granted') {
                    const album = await MediaLibrary.getAssetsAsync({
                        mediaType: 'photo',
                    });
                    setPhotos(album.assets);
                } else {
                    console.log('Permissions not granted');
                }
            } catch (error) {
                console.error("Error loading photos:", error);
            }
        }

        if (isFocused) {
            loadPhotos();
        }
    }, [isFocused]);

    const renderPhoto = ({ item }: { item: Asset }) => {
        return (
            <TouchableOpacity onPress={() => {
                setSelectedPhoto(item);
                setModalVisible(true);
            }}>
                <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gallery</Text>
            {photos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You don't have any photo</Text>
                </View>
            ) : (
                <FlatList
                    data={photos}
                    keyExtractor={(item: Asset) => item.id}
                    renderItem={renderPhoto}
                    numColumns={3}
                />
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalView}>
                        {selectedPhoto && (
                            <Image
                                source={{ uri: selectedPhoto.uri }}
                                style={styles.modalImage}
                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default Gallery;
