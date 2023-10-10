import { StyleSheet, View } from "react-native";
import React from 'react'
import FooterItem from './FooterItem'

const FooterList = () => {
    return (
        <View style={styles.container}>
            <FooterItem text="Accounts" name="university" />
            <FooterItem text="Payments" name="money-bill" />
            <FooterItem text="Transfers" name="exchange-alt" />
            <FooterItem text="Profile" name="user" />
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