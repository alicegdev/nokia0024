import { PermissionsAndroid } from 'react-native'
import RNFS from 'react-native-fs'

const MusicPlayerFooter = () => {
    console.log('RNFS', RNFS);
    let setSongs: any
    const requestExternalStoragePermission = async () => {
        const readPermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO;
        const hasPermission = await PermissionsAndroid.check(readPermission);
        if (hasPermission) {
          console.log('Permission Granted');
          return true;
        } else {
          try {
            const status = await PermissionsAndroid.request(readPermission);
            if (status === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Permission Granted');
              return true;
            } else {
              console.log('Permission Denied');
              return false;
            }
          } catch (error) {
            console.error('Permission Request Error: ', error);
            return false;
          }
        }
    };

    const handleReadDir = async (path: any) => {
        if (await requestExternalStoragePermission()) {
            try {
                const result = await RNFS.readDir(path);
                const audioFiles = result.filter(file =>
                    file.isFile() &&
                    (file.name.endsWith('.mp3'))
                );
    
                const directories = result.filter(file => file.isDirectory());
    
                await Promise.all(directories.map(async directory => {
                    await handleReadDir(directory.path);
                }));
    
                setSongs(prevState => [
                    ...prevState,
                    ...audioFiles.map(file => ({
                        name: file.name,
                        path: file.path
                    }))
                ]);
            } catch (error) {
                console.error('Directory Read Error: ', error);
            }
        }
    };

    return (
        setSongs
    )
}

export default MusicPlayerFooter;