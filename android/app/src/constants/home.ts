import InternetImage from "src/assets/icones/internet.png"
import PhoneImage from "src/assets/icones/phone.png"
import MessageImage from "src/assets/icones/message.png"
import MusicImage from "src/assets/icones/music.png"
import GameImage from "src/assets/icones/game.png"
import CameraImage from "src/assets/icones/camera.png"
import GalleryImage from "src/assets/icones/gallery.png"
import SettingsImage from "src/assets/icones/settings.png"

export const navHomes = [
    { id: GameImage, label: 'Games', navigateTo: 'Games' },
    { id: CameraImage, label: 'Camera', navigateTo: 'CameraScreen' },
    { id: GalleryImage, label: 'Gallery', navigateTo: 'Gallery' },
    { id: SettingsImage, label: 'Settings', navigateTo: 'Settings' },
];

export const navFooters = [
    { id: PhoneImage, navigateTo: 'ContactList' },
    { id: InternetImage, navigateTo: 'Internet' },
    { id: MessageImage, navigateTo: 'ChatScreen' },
    { id: MusicImage, navigateTo: 'Music' },
]