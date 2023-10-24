import { StyleSheet, View, Alert } from "react-native";
import React from 'react'
import FooterItem from './FooterItem'
import { useNavigation } from '@react-navigation/native';


const FooterList = (props) => {
    let email = ""
    let accounts = []
    if (props) {
        email = props.email;
        accounts = props.accounts;
    }
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <FooterItem text="Accounts" name="university" func={() => navigation.push('Accounts', {email})} />
            <FooterItem text="Payments" name="money-bill" func={() => navigation.push('Payments', {email, accounts})}/>
            <FooterItem text="Transfers" name="exchange-alt" func={() => navigation.push('Profile')}/>
            <FooterItem text="Profile" name="user" func={() => navigation.push('Profile', {email, accounts})}/>
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