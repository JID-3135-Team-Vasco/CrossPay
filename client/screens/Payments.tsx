import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, StyleSheet, TextInput, Text, View, Alert, Platform, Modal, TouchableOpacity} from 'react-native';
import { Input, Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import CurrencyInput from 'react-native-currency-input';
import Dialog from "react-native-dialog";

export function Payments({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;  
  const [linkToken, setLinkToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [profileName, setProfileName] = useState('');
  const [profileAccountNumber, setProfileAccountNumber] = useState('');
  const [profileRoutingNumber, setProfileRoutingNumber] = useState('');
  const [profileAccountType, setProfileAccountType] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountTypes, setAccountTypes] = useState([
    {label: 'Checking', value: 'checking', labelStyle: styles.labelText}, 
    {label: 'Savings', value: 'savings', labelStyle: styles.labelText}
  ]);
  const [accessToken, setAccessToken] = useState('');
  const [accountID, setAccountID] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [isInfoDisabled, setInfoDisabled] = useState(false);
  const [items, setItems] = useState([{label: '', value: null as string | null, labelStyle: {}}]);
  const [amount, setAmount] = useState(0.00 as number | null);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
  const [options, setOptions] = useState([
    {label: 'Enter Account Information Manually...', value: '!ManualEnter!', labelStyle: styles.labelText}
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditDialogVisible, setEditDialogVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const proceedWithPayment = () => {
    if (!value) {
      Alert.alert('Please choose a valid source account!');
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert('Please enter a nonzero amount!');
      return;
    }
    if (!paymentOption) {
      Alert.alert('Please choose a valid destination account!');
      return;
    }
    if (paymentOption === '!ManualEnter!') {
      setAccessToken('');
      setAccountID('');
      setAccountNumber('');
      setRoutingNumber('');
      setAccountType('checking');
      setInfoDisabled(false);
      toggleModal();
    } else {
      let paymentProfileInfo = paymentOption?.split('?cross?');
      if (paymentProfileInfo.length != 7) {
        Alert.alert('Unexpected error!');
        return;
      }
      setAccessToken(paymentProfileInfo[0]);
      setAccountID(paymentProfileInfo[1]);
      setAccountNumber(paymentProfileInfo[3]);
      setRoutingNumber(paymentProfileInfo[4]);
      setAccountType(paymentProfileInfo[5]);
      setInfoDisabled(true);
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
      dest_account_id: accountID,
      dest_access_token: accessToken,
      ledger_transfer_id: '',
      destination_transfer_id: ''
    };

    if (balance < amount) {
      Alert.alert('You only have $' + balance + ' in this account!');
      return;
    }
    if (accountID === '' || accessToken === '') {
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
    }
    
    if (!payment.dest_access_token || payment.dest_access_token.length == 0 || !payment.dest_account_id || payment.dest_account_id.length == 0) {
      Alert.alert('Unexpected error!');
      return;
    }

    let settlementDate = "";
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
        if (data.error) {
          Alert.alert(data.error);
          return;
        }
        payment.time = data.transfer.created;
        payment.ledger_transfer_id = data.transfer.id;
        settlementDate = data.transfer.expected_settlement_date;
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error with your transfer!');
        return;
      });
    
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
        if (data.error) {
          payment.destination_transfer_id = payment.ledger_transfer_id;
        } else {
          payment.time = data.transfer.created;
          payment.destination_transfer_id = data.transfer.id;
          settlementDate = data.transfer.expected_settlement_date;
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error with your transfer!');
        return;
      });
    console.log(payment);
    await axios.post(`http://${address}:8000/payments/update-payments`, {
      email: email, 
      payment: payment,
    }) 
    toggleModal();
    Alert.alert('Your payment is successful!');
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

  const getPaymentProfiles = async () => {
    console.log("getting payment profiles");
    let updatedOptions = [];
    let userProfiles: any[] = [];
    await axios
    .get(`http://${address}:8000/payment-profiles/get-payment-profiles`, {
        params: { email: email },
    })
    .then(function (response) {
        userProfiles = response.data.payment_profiles;
        console.log(userProfiles);
    })
    if (userProfiles != null && userProfiles.length > 0) {
      console.log("here");
        userProfiles.forEach((userProfile: any) => {
          updatedOptions.push(
            {
              label: userProfile.name, 
              value: (userProfile.access_token + "?cross?" + userProfile.account_id + "?cross?" + userProfile.name + "?cross?" 
                + userProfile.account_number + "?cross?" + userProfile.routing_number + "?cross?" + userProfile.type
                + "?cross?" + userProfile._id) as string | null, 
              labelStyle: styles.labelText
            }
          );
        })
    }
    updatedOptions.push({label: 'Enter Account Information Manually', value: '!ManualEnter!', labelStyle: styles.labelText});
    setOptions(updatedOptions);
  }

  const showDialog = () => {
    setProfileName('');
    setProfileAccountNumber('');
    setProfileRoutingNumber('');
    setProfileAccountType('');
    setDialogVisible(true);
  };
  const showEditDialog = () => {
    if (!paymentOption || paymentOption === '!ManualEnter!') {
      Alert.alert('Please choose a valid payment profile!');
      return;
    }
    
    let paymentProfileInfo = paymentOption?.split('?cross?');
    if (paymentProfileInfo.length != 7) {
      Alert.alert('Unexpected error!');
      return;
    }
    setProfileName(paymentProfileInfo[2]);
    setProfileAccountNumber(paymentProfileInfo[3]);
    setProfileRoutingNumber(paymentProfileInfo[4]);
    setProfileAccountType(paymentProfileInfo[5].substring(0, 1).toUpperCase() + paymentProfileInfo[5].substring(1));
    setEditDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const deletePaymentProfile = async () => {
    const profile_id = paymentOption?.split('?cross?')[6];
    const resp = await axios.post(`http://${address}:8000/payment-profiles/delete-payment-profile`, {
        email: email,
        profile_id: profile_id,
    });
    if (resp.data.error) {
      Alert.alert(resp.data.error);
    } else {
      await getPaymentProfiles();
      setEditDialogVisible(false);
      navigation.push('Payments', {email, accounts});
      Alert.alert('Payment profile successfully deleted!');
    }
  };

  const updatePaymentProfile = async () => {

    const profile_id = paymentOption?.split('?cross?')[6];
    
    if (profileAccountType.toLowerCase() !== 'checking' && profileAccountType.toLowerCase() !== 'savings') {
      Alert.alert('Please enter a valid account type!');
      return;
    }
    if (!profileAccountNumber || profileAccountNumber.length < 4 || profileAccountNumber.length > 17) {
      Alert.alert('Please enter a valid account number of 4-17 numbers!');
      return;
    }
    if (!profileRoutingNumber || profileRoutingNumber.length != 9) {
      Alert.alert('Please enter a valid routing number of 9 numbers!');
      return;
    }

    let profile_access_token = '';
    let profile_account_id = '';

    await fetch(`http://${address}:8000/api/payment/authorize`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({account_number: profileAccountNumber, routing_number: profileRoutingNumber, account_type: profileAccountType.toLowerCase()}),
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
        profile_access_token = data.access_token;
        profile_account_id = data.account_id;
      })
      .catch(err => {
        console.log(err);
        return;
      });
    
    const resp = await axios.post(`http://${address}:8000/payment-profiles/update-payment-profile`, {
        email: email, 
        name: profileName,
        account_number: profileAccountNumber,
        routing_number: profileRoutingNumber,
        type: profileAccountType.toLowerCase(),
        access_token: profile_access_token,
        account_id: profile_account_id,
        existing_id: profile_id,
    });
    if (resp.data.error) {
      Alert.alert(resp.data.error);
    } else {
      await getPaymentProfiles();
      setEditDialogVisible(false);
      navigation.push('Payments', {email, accounts});
      Alert.alert('Payment profile successfully updated!');
    }

  }

  const addPaymentProfile = async () => {
    
    if (profileAccountType.toLowerCase() !== 'checking' && profileAccountType.toLowerCase() !== 'savings') {
      Alert.alert('Please enter a valid account type: checking or savings!');
      return;
    }
    if (!profileAccountNumber || profileAccountNumber.length < 4 || profileAccountNumber.length > 17) {
      Alert.alert('Please enter a valid account number of 4-17 numbers!');
      return;
    }
    if (!profileRoutingNumber || profileRoutingNumber.length != 9) {
      Alert.alert('Please enter a valid routing number of 9 numbers!');
      return;
    }

    let profile_access_token = '';
    let profile_account_id = '';

    await fetch(`http://${address}:8000/api/payment/authorize`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({account_number: profileAccountNumber, routing_number: profileRoutingNumber, account_type: profileAccountType.toLowerCase()}),
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
        profile_access_token = data.access_token;
        profile_account_id = data.account_id;
      })
      .catch(err => {
        console.log(err);
        return;
      });
    
    const resp = await axios.post(`http://${address}:8000/payment-profiles/add-payment-profile`, {
        email: email, 
        name: profileName,
        account_number: profileAccountNumber,
        routing_number: profileRoutingNumber,
        type: profileAccountType.toLowerCase(),
        access_token: profile_access_token,
        account_id: profile_account_id,
    });
    if (resp.data.error) {
      Alert.alert(resp.data.error);
    } else {
      await getPaymentProfiles();
      setDialogVisible(false);
      navigation.push('Payments', {email, accounts});
      Alert.alert('Payment profile successfully added!');
    }

  }
  
  useEffect(() => {
    getAccounts();
    getPaymentProfiles();
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
            setValue={setPaymentOption}
            setItems={setOptions}
            theme="LIGHT"
            placeholder="Select an account"
            style={styles.dropdown}
          />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttons} onPress={showDialog}>
            <Text style={styles.buttonText}>Add Payment Profile</Text>
            <Dialog.Container visible={isDialogVisible}>
              <Dialog.Title>Add Payment Profile</Dialog.Title>
              <Dialog.Input value={profileName} placeholder='Profile Name' onChangeText={setProfileName}></Dialog.Input>
              <Dialog.Input value={profileAccountNumber} placeholder='Account Number' onChangeText={setProfileAccountNumber}></Dialog.Input>
              <Dialog.Input value={profileRoutingNumber} placeholder='Routing Number' onChangeText={setProfileRoutingNumber}></Dialog.Input>
              <Dialog.Input value={profileAccountType} placeholder='Account Type' onChangeText={setProfileAccountType}></Dialog.Input>
              <Dialog.Button label="Cancel" onPress={handleCancel} />
              <Dialog.Button label="Confirm" onPress={addPaymentProfile} />
            </Dialog.Container>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={showEditDialog}>
            <Text style={styles.buttonText}>Edit Payment Profile</Text>
            <Dialog.Container visible={isEditDialogVisible}>
              <Dialog.Title>Edit Payment Profile</Dialog.Title>
              <Dialog.Input value={profileName} placeholder='Profile Name' onChangeText={setProfileName}></Dialog.Input>
              <Dialog.Input value={profileAccountNumber} placeholder='Account Number' onChangeText={setProfileAccountNumber}></Dialog.Input>
              <Dialog.Input value={profileRoutingNumber} placeholder='Routing Number' onChangeText={setProfileRoutingNumber}></Dialog.Input>
              <Dialog.Input value={profileAccountType} placeholder='Account Type' onChangeText={setProfileAccountType}></Dialog.Input>
              <Dialog.Button label="Delete Profile" onPress={deletePaymentProfile} />
              <Dialog.Button label="Update Profile" onPress={updatePaymentProfile} />
            </Dialog.Container>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.buttons} onPress={proceedWithPayment}>
          <Text style={styles.buttonText}>Proceed with Payment</Text>
        </TouchableOpacity>
          <Modal
            animationType="slide"
            presentationStyle="formSheet"
            transparent={false}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View>

            <Text style={styles.subtitle}>Destination Account Information: </Text>           
            <Input
              placeholder="Account Number"
              disabled={isInfoDisabled}
              value={accountNumber}
              onChangeText={setAccountNumber}
              autoCapitalize="none"
            />
            <Input
              placeholder="Routing Number"
              disabled={isInfoDisabled}
              value={routingNumber}
              onChangeText={setRoutingNumber}
            />
            <DropDownPicker
              open={typeOpen}
              value={accountType}
              disabled={isInfoDisabled}
              items={accountTypes}
              setOpen={setTypeOpen}
              setValue={setAccountType}
              setItems={setAccountTypes}
              theme="LIGHT"
              placeholder="Account Type"
              style={styles.destDropdown}
            />
            <View style={styles.buttonContainer}> 
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
            </View>
          </Modal>


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
    width: 150,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    width: 150,
    alignSelf: 'center',
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
    width: 200,
    alignSelf: 'center',
  },
  buttons: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 30, 
    marginRight: 15,
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  editButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 30,
    marginRight: 15,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 4,
    marginTop: 30,
    alignItems: 'center', 
    marginBottom: 20, 
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
  buttonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
