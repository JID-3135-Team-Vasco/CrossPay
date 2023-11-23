import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, View, Alert, Platform, Modal, TouchableOpacity} from 'react-native';
import { Input, Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import CurrencyInput from 'react-native-currency-input';

export function Payments({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;  
  const [linkToken, setLinkToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountTypes, setAccountTypes] = useState([
    {label: 'Checking', value: 'checking', labelStyle: styles.labelText}, 
    {label: 'Savings', value: 'savings', labelStyle: styles.labelText}
  ]);
  const [accountType, setAccountType] = useState(null);
  const [items, setItems] = useState([{label: '', value: null as string | null, labelStyle: {}}]);
  const [amount, setAmount] = useState(0.00 as number | null);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
  const [options, setOptions] = useState([
    {label: 'Existing Payment Profile', value: 'profile', labelStyle: styles.labelText}, 
    {label: 'Enter Account Information', value: 'accountInfo', labelStyle: styles.labelText}
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOptionSelect = (value: string) => {
    setPaymentOption(value);
    console.log(value);
    console.log(paymentOption)
    if (paymentOption === 'accountInfo') {
      toggleModal();
    }
  };

  
  const onPressConfirm = async () => {
    if (!value) {
      Alert.alert('Please choose a valid source account!');
      return;
    }
    if (!accountType) {
      Alert.alert('Please choose a valid account type!');
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert('Please enter a nonzero amount!');
      return;
    }
    if (!accountNumber || accountNumber.length < 4 || accountNumber.length > 17) {
      Alert.alert('Please enter a valid account number of 4-17 numbers!');
      return;
    }
    if (!routingNumber || routingNumber.length != 9) {
      Alert.alert('Please enter a valid routing number of 9 numbers!');
      return;
    }
    const access_token = value.split('?cross?')[0];
    const account_id = value.split('?cross?')[1];
    const balance = value.split('?cross?')[2];
    const account_name = value.split('?cross?')[3];

    let payment = {
      source_account: account_name,
      source_account_id: account_id,
      source_access_token: access_token,
      amount: amount,
      time: '',
      dest_account_number: accountNumber,
      dest_routing_number: routingNumber,
      dest_account_id: '',
      dest_access_token: '',
      ledger_transfer_id: '',
      destination_transfer_id: ''
    };

    if (balance < amount) {
      Alert.alert('You only have $' + balance + ' in this account!');
      return;
    }

    await fetch(`http://${address}:8000/api/payment/authorize`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({account_number: accountNumber, routing_number: routingNumber, account_type: accountType}),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error && data.error.indexOf("account_number") != -1) {
          Alert.alert('Please enter a valid account number of 4-17 numbers!');
          return;
        } else if (data.error && data.error.indexOf("routing_number") != -1) {
          Alert.alert('Please enter a valid routing number of 9 numbers!');
          return;
        } else if (data.error) {
          Alert.alert(data.error);
          return;
        }
        payment.dest_access_token = data.access_token;
        payment.dest_account_id = data.account_id;
      })
      .catch(err => {
        console.log(err);
        return;
      });
    
    if (!payment.dest_access_token || payment.dest_access_token.length == 0 || !payment.dest_account_id || payment.dest_account_id.length == 0) {
      return;
    }

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
        payment.ledger_transfer_id = data.transfer.id;;
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
        body: JSON.stringify({access_token: payment.dest_access_token, account_id: payment.dest_account_id, amount: amount?.toFixed(2), email: email}),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        payment.time = data.transfer.created;
        payment.destination_transfer_id = data.transfer.id
        settlementDate = data.transfer.expected_settlement_date;
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error with your transfer!');
      });
    
    await axios.post(`http://${address}:8000/payments/update-payments`, {
      email: email, 
      payment: payment,
    }) 
    Alert.alert('Your payment is successful!\nIt should be settled by ' + new Date(settlementDate).toLocaleDateString());
    navigation.push('Accounts', {email});
  };
  
  const getAccounts = () => {
    let dropdownItems: { label: string; value: string | null; labelStyle: {}}[] = []
    accounts.forEach((account: any) => {
      let balance = account.type === "credit" ? account.balances['current'] : account.balances['available']
      dropdownItems.push({label: account.name, value: (account.access_token + "?cross?" + account.account_id + "?cross?" + balance + "?cross?" + account.name) as string | null, labelStyle: styles.labelText})
    })
    setItems(dropdownItems);
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
            open={optionOpen}
            value={paymentOption}
            items={options}
            setOpen={setOptionOpen}
            setValue={(value) => handleOptionSelect(value)}
            setItems={setOptions}
            theme="LIGHT"
            placeholder="Payment Destination:"
            style={styles.dropdown}
          />
          
          {paymentOption==="accountInfo" ?
          <Modal
            animationType="slide"
            presentationStyle="pageSheet"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View>

            <Text style={styles.subtitle}>Account Information: </Text>           
            <Input
              placeholder="Account Number"
              onChangeText={setAccountNumber}
              autoCapitalize="none"
            />
            <Input
              placeholder="Routing Number"
              onChangeText={setRoutingNumber}
            />
            <DropDownPicker
              open={typeOpen}
              value={accountType}
              items={accountTypes}
              setOpen={setTypeOpen}
              setValue={setAccountType}
              setItems={setAccountTypes}
              theme="LIGHT"
              placeholder="Account Type"
              style={styles.destDropdown}
            />
            <Button 
              title="Save Payment Profile"
              buttonStyle={styles.mainButton}
            />             
            <Button
              title="Pay"
              onPress={onPressConfirm}
              buttonStyle={styles.mainButton}
            />             
            <Button 
              title="Close"
              onPress={toggleModal}
              buttonStyle={styles.closeButton}
            />
              
            
            </View>
          </Modal>
          : null}


        </View>
        <FooterList email={email} accounts={accounts}/>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set a background color
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  mainButton: {
    width: 200,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    width: 200,
    alignSelf: 'center',
    marginTop: 100,
    backgroundColor: COLORS.red,
  },
  dropdownContainer: {
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  destDropdown: {
    marginTop: 10,
    marginBottom: 20,
    width: 200,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    marginVertical: 5,
    width: 200,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center'
  },
});
