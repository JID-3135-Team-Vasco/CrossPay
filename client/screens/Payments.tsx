import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, View, Alert, Platform} from 'react-native';
import { Input, Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import {PlaidLink, LinkExit, LinkSuccess} from 'react-native-plaid-link-sdk';
import CurrencyInput from 'react-native-currency-input';

export function Payments({route, navigation}: {route: any, navigation: any}): React.ReactElement {

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
      Alert.alert('Please choose an account!');
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert('Please enter a nonzero amount!');
      return;
    }

    const account_id = value.split('??')[0]
    const balance = value.split('??')[1]

    if (balance < amount) {
      let valueString = JSON.stringify(value)
      Alert.alert('You only have $' + valueString + ' in this account!');
      return;
    } 

    await createTransferLinkToken(account_id);
    
    Alert.alert('You will be redirected to Plaid!');
  };
  
  const getAccounts = () => {
    let dropdownItems: { label: string; value: string | null; labelStyle: {}}[] = []
    accounts.forEach((account: any) => {
      let balance = account.type === "credit" ? account.balances['current'] : account.balances['available']
      dropdownItems.push({label: account.name, value: (account.account_id + "??" + balance) as string | null, labelStyle: styles.labelText})
    })
    setItems(dropdownItems);
    setDestItems(dropdownItems);
  }

  useEffect(() => {
    getAccounts();
  },[])

  const createTransferLinkToken = async (account_id: string) => {

    let transferIntentId = '';
    await fetch(`http://${address}:8000/api/create_transfer_intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({amount: amount?.toFixed(2), account_id: account_id}),
    })
      .then(response => response.json())
      .then(data => {
        console.log("success")
        transferIntentId = data.transfer_intent_id
      })
      .catch(err => {
        console.log(err);
      });

    await fetch(`http://${address}:8000/api/create_transfer_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, address: address, transfer_intent_id: transferIntentId}),
    })
      .then(response => response.json())
      .then(data => {
        setLinkToken(data.link_token);
      })
      .catch(err => {
        console.log(err);
      });    
  };
  
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
            title="Confirm Amount"
            onPress={onPressConfirm}
            buttonStyle={styles.mainButton}
          />
          {/* <PlaidLink
          tokenConfig={{
            token: linkToken,
            noLoadingState: false,
          }}
          onSuccess={async (success: LinkSuccess) => {
            console.log(success.metadata.accounts);
            await fetch(`http://${address}:8000/api/exchange_public_token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({public_token: success.publicToken, email: email}),
            }).catch(err => {
              console.log(err);
            });
          }}
          onExit={(response: LinkExit) => {
            console.log(response);
          }}>
          <Text style={styles.mainButton}>Make Payment</Text>
        </PlaidLink> */}
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
      marginBottom: 20,
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
