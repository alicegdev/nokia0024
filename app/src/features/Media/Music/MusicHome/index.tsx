import React from "react";
import { useNavigation } from '@react-navigation/native';
import { color } from "src/styles";
import { Screen } from "src/components";



const MusicHome = () => {
    const navigation: any = useNavigation();

    return (
        <Screen style={{ backgroundColor: color.menu }}>
            test
        </Screen>
    )
}

export default MusicHome;