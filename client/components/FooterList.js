import { StyleSheet, View, Alert } from "react-native";
import React from 'react'
import FooterItem from './FooterItem'
import { NavigationContainer } from '@react-navigation/native';
import * as RootNavigation from './RootNavigation'

const FooterList = ({navigation}) => {
    return (
        <View style={styles.container}>
            <FooterItem text="Accounts" name="university" func={tempFunc} />
            <FooterItem text="Payments" name="money-bill" func={tempFunc}/>
            <FooterItem text="Transfers" name="exchange-alt" func={tempFunc2}/>
            <FooterItem text="Profile" name="user" func={() => RootNavigation.navigate('Profile')}/>
        </View>
    )
}

const moveToProfile = function({ navigation }) {
    // Alert.alert("Move screen to profile.");
    navigation.navigate('Profile');
}

const tempFunc = function() {
    Alert.alert("Play Outer Wilds. It's a really good game I promise.");
}

const tempFunc2 = function() {
    Alert.alert("The Universe is. And we are.");
}

const tempFunc3 = function() {
    Alert.alert("Crazy? I was crazy once. They put me in a room. A rubber room. A rubber room with rats. And rats make me crazy. Crazy?");
}

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      margin: 10,
      marginHorizontal: 30,
      justifyContent: 'space-between',
    },
});

export default FooterList;