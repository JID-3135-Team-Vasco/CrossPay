import React, {useState, useEffect} from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import {COLORS} from './Colors';
import {Input, Button, Icon} from 'react-native-elements';
import { Platform, TouchableOpacity } from 'react-native';
import FooterList from '../components/FooterList';
import axios from 'axios';
import Dialog from "react-native-dialog";

export function AccountInfo({route, navigation}: {route: any, navigation: any}): React.ReactElement {
  const { item, email, accounts } = route.params;
  const { name, type } = item;


  const [visible, setVisible] = useState(false);
  const [nickname, setNickname] = useState(name);
  let balance = type === "credit" ? item.balances['current'] : item.balances['available'];
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

  useEffect(() => {
    getBalance();
  },[])

  const getBalance = async () => {
    let balances = item.balances;
    await fetch(`http://${address}:8000/api/balances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({access_token: item.access_token}),
      })
      .then(response => response.json())
      .then(data => {
        balances = data.balances;
      })
    console.log(balances);
    console.log(item.balances);
    if (balances['current'] === item.balances['current'] && balances['available'] === item.balances['available']) {
      console.log('no update');
      return;
    }
    accounts.forEach((account: any) => {
      if (account === item) {
        account.balances = balances;
        return;
      }
    });
    item.balances = balances;
    balance = type === "credit" ? item.balances['current'] : item.balances['available'];
    await axios.post(`http://${address}:8000/accounts/update-accounts`, {
      email: email, 
      accounts: accounts,
    })
  }
  
  const deleteAccount = async () => {
    let i:number = 0;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i] === item) {
        accounts.splice(i, 1);
        break;
      }
    }
    await axios.post(`http://${address}:8000/accounts/update-accounts`, {
      email: email, 
      accounts: accounts,
    })
    .then(function (response) {
      navigation.push('Accounts', {email});
    });
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleEdit = async () => {
    accounts.forEach((account: any) => {
      if (account === item) {
        account.name = nickname;
        return;
      }
    });
    await axios.post(`http://${address}:8000/accounts/update-accounts`, {
      email: email, 
      accounts: accounts,
    })
    .then(function (response) {
      navigation.push('Accounts', {email});
    });
    navigation.push('Accounts', {email});
    setVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{name}</Text>
        <Text style={styles.balanceText}>Balance: ${balance}</Text>
        <Button
            title="Back"
            buttonStyle={styles.mainButton}
            onPress={() => navigation.push('Accounts', {email})}
          />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={showDialog}>
          <Text style={styles.buttonText}>Edit Nickname</Text>
          <Dialog.Container visible={visible}>
            <Dialog.Title>Edit Nickname</Dialog.Title>
            <Dialog.Input value={nickname} onChangeText={setNickname}></Dialog.Input>
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Confirm" onPress={handleEdit} />
          </Dialog.Container>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <FooterList email={email} accounts={accounts}/>
    </SafeAreaView>
    

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainButton: {
    width: 100,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 4,
    alignItems: 'center', 
    marginBottom: 20, 
  },
  editButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 30, 
    marginLeft: 15,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 30,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  bottom: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 32,
      paddingBottom: 64,
  },
  balanceText: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
  },
  titleText: {
    fontSize: 25, 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    paddingTop: 20, 
    color: 'black'
  }
});

