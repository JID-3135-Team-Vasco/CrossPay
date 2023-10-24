import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, View, Alert} from 'react-native';
import { Input, Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import CurrencyInput from 'react-native-currency-input';

export function Payments({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;  
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{label: '', value: null as number | null, labelStyle: {}}]);
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState(0.000 as number | null);

  
  const onPressPay = async () => {
    if (!value) {
      Alert.alert('Please choose an account!');
      return;
    }
    else if (!amount || amount <= 0) {
      Alert.alert('Please enter a nonzero amount!');
      return;
    }
    else if (value < amount) {
      let valueString = JSON.stringify(value)
      Alert.alert('You only have $' + valueString + ' money in this account!');
      return;
    } 
    
    Alert.alert('You will be redirected to Plaid!');
  };
  
  const getAccounts = () => {
    let dropdownItems: { label: string; value: number | null; labelStyle: {}}[] = []
    accounts.forEach((account: any) => {
      let balance = account.type === "credit" ? account.balances['current'] : account.balances['available']
      dropdownItems.push({label: account.name, value: balance as number | null, labelStyle: styles.labelText})
    })
    setItems(dropdownItems);
  }

  useEffect(() => {
    getAccounts();
  },[])
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Account: </Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
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
          <Button
            title="Proceed with Payment"
            onPress={onPressPay}
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
      marginBottom: 30,
      width: 200,
      fontSize: 14,
      borderWidth: 1,
      padding: 10,
    },
});
