import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, View, Alert, Platform} from 'react-native';
import { Input, Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import CurrencyInput from 'react-native-currency-input';

export function Transfers({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;  
  const [linkToken, setLinkToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [destOpen, setDestOpen] = useState(false);
  const [destValue, setDestValue] = useState(null);
  const [items, setItems] = useState([{label: '', value: null as string | null, labelStyle: {}}]);
  const [destItems, setDestItems] = useState([{label: '', value: null as string | null, labelStyle: {}}]);
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState(0.00 as number | null);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

  
  const onPressConfirm = async () => {
    if (!value) {
      Alert.alert('Please choose a valid source account!');
      return;
    }
    if (!destValue) {
      Alert.alert('Please choose a valid destination account!');
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert('Please enter a nonzero amount!');
      return;
    }
    const access_token = value.split('?cross?')[0];
    const account_id = value.split('?cross?')[1];
    const balance = value.split('?cross?')[2];

    if (balance < amount) {
      let valueString = JSON.stringify(value)
      Alert.alert('You only have $' + valueString + ' in this account!');
      return;
    } 

    const dest_access_token = destValue.split('?cross?')[0];
    const dest_account_id = destValue.split('?cross?')[1];

    let transfer: any[] = [];

    await fetch(`http://${address}:8000/api/transfer/ledger`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({access_token: access_token, account_id: account_id, amount: amount?.toFixed(2), email: email}),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        transfer.push(data.transfer);
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error with your transfer!');
      });
    
    let settlementDate = "";
    await fetch(`http://${address}:8000/api/transfer/destination`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({access_token: dest_access_token, account_id: dest_account_id, amount: amount?.toFixed(2), email: email}),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        transfer.push(data.transfer);
        settlementDate = transfer[1].expected_settlement_date;
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error with your transfer!');
      });
    
    await axios.post(`http://${address}:8000/transfers/update-transfers`, {
      email: email, 
      transfer: transfer,
    }) 
    Alert.alert('Your transfer is successful!\nIt should be settled by ' + new Date(settlementDate).toLocaleDateString());
    navigation.push('Accounts', {email});
  };
  
  const getAccounts = () => {
    let dropdownItems: { label: string; value: string | null; labelStyle: {}}[] = []
    accounts.forEach((account: any) => {
      let balance = account.type === "credit" ? account.balances['current'] : account.balances['available']
      dropdownItems.push({label: account.name, value: (account.access_token + "?cross?" + account.account_id + "?cross?" + balance) as string | null, labelStyle: styles.labelText})
    })
    setItems(dropdownItems);
    setDestItems(dropdownItems);
  }

  useEffect(() => {
    getAccounts();
  },[])
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Source Account: </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onSelectItem={(selectedItem) => {
              setDestItems(items.filter(item => item !== selectedItem))
            }}
            theme="LIGHT"
            placeholder="Select an account"
            style={styles.dropdown}
          />
          <Text style={styles.subtitle}>Amount: </Text>
          <CurrencyInput
            value={amount}
            onChangeValue={setAmount}
            prefix="$"
            delimiter=","
            style={styles.input}
            separator="."
            precision={2}
            minValue={0}
            placeholder='$10.00'
          />
          <Text style={styles.subtitle}>Destination Account: </Text>
          <DropDownPicker
            open={destOpen}
            value={destValue}
            items={destItems}
            disabled={value == null || destItems.length == items.length}
            setOpen={setDestOpen}
            setValue={setDestValue}
            setItems={setDestItems}
            theme="LIGHT"
            placeholder="Select an account"
            style={styles.destDropdown}
          />
          <Button
            title="Transfer"
            onPress={onPressConfirm}
            buttonStyle={styles.mainButton}
          />
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
      width: 200,
      textAlign: 'center',
      backgroundColor: COLORS.primary,
    },
    dropdown: {
      alignSelf: 'center',
      marginTop: 10,
      width: 200,
    },
    destDropdown: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 60,
      width: 200,
    },
    content: {
      flex: 1,
      alignItems: 'center'
    },
    subtitle: {
      fontSize: 20,
      marginTop: 20,
      padding: 10,
    },
    labelText: {
      fontSize: 14,
      padding: 10,
      color: 'black',
    },
    input: {
      height: 60,
      margin: 12,
      width: 200,
      fontSize: 14,
      borderWidth: 1,
      padding: 10,
    },
});
