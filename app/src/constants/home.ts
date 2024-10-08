import InternetImage from "src/assets/icones/internet.png"
import PhoneImage from "src/assets/icones/phone.png"
import MessageImage from "src/assets/icones/message.png"
import MusicImage from "src/assets/icones/music.png"

export const navHomes = [
    { id: 1, label: 'test signin', navigateTo: 'Signin' },
    { id: 2, label: 'Games', navigateTo: 'Games' },
    { id: 3, label: 'Settings', navigateTo: 'Settings' },
    { id: 4, label: 'Camera', navigateTo: 'CameraScreen' },
    { id: 5, label: 'Gallery', navigateTo: 'Gallery' },
];

export const navFooters = [
    { id: PhoneImage, navigateTo: 'ContactList' },
    { id: InternetImage, navigateTo: 'Internet' },
    { id: MessageImage, navigateTo: 'Text' },
    { id: MusicImage, navigateTo: 'Music' },
]