import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";
import { color, spacing } from "src/styles";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "src/contexts/AuthContext";
import LoadingAnimation from "src/components/LoadingAnimation";
import { useNavigation } from "@react-navigation/native";

type AccountProps = {
  email: string;
  password: string;
  username: string;
};

interface DecodedToken {
  id: number;
}

type MenuLink = {
  key: string;
  label: string;
};
const Account = () => {
  const [userData, setUserData] = useState<AccountProps | null>();
  const { state } = useContext(AuthContext);
  const token = state.token;
  const userId = state.userId;
  const navigation:any = useNavigation();  // Hook for navigation

  const menuLinks = [
    {
      key: "DeleteAccount",
      label: "Delete account",
    },
    { key: "ChangePassword", label: "Change password" },
  ];
  const getUserById = async () => {
    if (token && userId) {
      try {
        const response = await axios.get<AccountProps>(
          `https://n0kia-0024.com/users/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserById();
      setUserData(data);
    };
    fetchData();
  }, []);

  if (!userData) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.lg }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color.menu, paddingTop: spacing.lg }}
    >
      <Text style={styles.settings}>Account</Text>
      <View style={{ flex: 1, marginBottom: "15%" }}>
        <ScrollView>
          <View style={styles.list}>
            {Object.entries(userData).map(([key, value]) => (
              <Text style={styles.textList} key={key}>
                {key} : {value}
              </Text>
            ))}
          </View>

          {menuLinks.map((link: MenuLink) => (
                        <View style={styles.list}>

              <TouchableOpacity
                key={link.key}
                onPress={() => navigation.navigate(link.key)}
              >
                <Text style={styles.textList}>
                  {link.label}
                  </Text>
              </TouchableOpacity>
                        </View>

            ))}
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Account;
