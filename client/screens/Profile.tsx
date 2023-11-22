import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, ScrollView, Platform, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import FooterList from '../components/FooterList';
import {COLORS} from './Colors';
import Collapsible from 'react-native-collapsible';
import axios from 'axios';

export function Profile({route, navigation}: {route: any, navigation: any}): React.ReactElement {

  const { email, accounts } = route.params;
  const [payments, setPayments] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [isPaymentsCollapsed, setIsPaymentsCollapsed] = useState(true);
  const [isTransfersCollapsed, setIsTransfersCollapsed] = useState(true);

  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

  const getPayments = async () => {
    await axios
    .get(`http://${address}:8000/payments/get-payments`, {
        params: { email: email },
    })
    .then(function (response) {
        let userPayments = response.data.payments;
        setPayments(userPayments);
    })
    .catch(function (error) {
        console.error(error);
    });
  };

  const getTransfers = async () => {
    await axios
    .get(`http://${address}:8000/transfers/get-transfers`, {
        params: { email: email },
    })
    .then(function (response) {
        let userTransfers = response.data.transfers;
        setTransfers(userTransfers);
    })
    .catch(function (error) {
        console.error(error);
    });
  };


  useEffect(() => {
    getPayments();
    getTransfers();
  },[])

  const logOut = function () {
    //TODO: ASYNC STORAGE
    navigation.push('SignIn');
  }
  
    return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Payments Collapsible */}
        <View style={styles.collapsibleContent}>
          <Button
            title="Payments"
            buttonStyle={styles.toggleButton}
            onPress={() => setIsPaymentsCollapsed(!isPaymentsCollapsed)}>
          </Button>

          <Collapsible collapsed={isPaymentsCollapsed}>
            <ScrollView style={styles.scrollContainer}>
              {payments.map((payment, index) => (
                <View key={index} style={styles.listItem}>
                  <Text>Source: {payment.source_account}</Text>
                  <Text>Destination Account Number: {payment.dest_account_number}</Text>
                  <Text>Destination Routing Number: {payment.dest_routing_number}</Text>
                  <Text>Amount: {payment.amount}</Text>
                  <Text>Time: {new Date(payment.time).toLocaleString()}</Text>
                </View>
              ))}
            </ScrollView>
          </Collapsible>
        </View>

        {/* Transfers Collapsible */}
        <View style={styles.collapsibleContent}>
          <Button
            title="Transfers"
            buttonStyle={styles.toggleButton}
            onPress={() => setIsTransfersCollapsed(!isTransfersCollapsed)}>
          </Button>

          <Collapsible collapsed={isTransfersCollapsed}>
            <ScrollView style={styles.scrollContainer}>
              {transfers.map((transfer, index) => (
                <View key={index} style={styles.listItem}>
                  <Text>Source: {transfer.source_account}</Text>
                  <Text>Destination Account Number: {transfer.dest_account}</Text>
                  <Text>Amount: {transfer.amount}</Text>
                  <Text>Time: {new Date(transfer.time).toLocaleString()}</Text>
                </View>
              ))}
            </ScrollView>
          </Collapsible>
        </View>

        {/* Log Out Button */}
        <Button
          title="Log Out"
          buttonStyle={styles.mainButton}
          onPress={logOut}
        />
      </ScrollView>
      <FooterList email={email} accounts={accounts} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
  },
  mainButton: {
    marginTop: 20,
    padding: 10,
    width: 250,
    backgroundColor: COLORS.red,
  },
  toggleButton: {
    width: Dimensions.get('window').width - 30,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 4,
    alignItems: 'center',
    padding: 20,
  },
  collapsibleContent: {
    width: '100%',
    marginVertical: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  titleText: {
    fontSize: 20,
    color: 'black',
    marginTop: 20,
    marginBottom: 30,
  },
});