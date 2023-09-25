import { StyleSheet, View } from "react-native";
import React from 'react'
import FooterItem from './FooterItem'

const FooterList = () => {
    return (
        <View style={styles.container}>
            <FooterItem text="Accounts" name="home" />
            <FooterItem text="Payments" name="plus-square" />
            <FooterItem text="Transfers" name="list-ol" />
            <FooterItem text="Settings" name="user" />
        </View>
    )
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