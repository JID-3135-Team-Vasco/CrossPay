import React, {useState, useEffect, useCallback} from 'react';
import {
  Platform,
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {COLORS} from './Colors';
import {PlaidLink, LinkExit, LinkSuccess} from 'react-native-plaid-link-sdk';
import FooterList from '../components/FooterList';
import axios from 'axios';
import { TouchableOpacity } from 'react-native';



export function Accounts({route, navigation}: {route: any, navigation: any}): React.ReactElement {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
  const { email } = route.params;

  const createLinkToken = useCallback(async () => {
    await fetch(`http://${address}:8000/api/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address: address}),
    })
      .then(response => response.json())
      .then(data => {
        setLinkToken(data.link_token);
      })
      .catch(err => {
        console.log(err);
      });
  }, [setLinkToken]);

  // Fetch account data
  const addNewAccounts = useCallback(async () => {
    let finalAccounts;
    await fetch(`http://${address}:8000/api/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        finalAccounts = accounts;
        let newAccounts = data.accounts.accounts;
        newAccounts.forEach((account: any) => {
          finalAccounts.push(account);
        });
      })
      .catch(err => {
        console.log(err);
      });
      console.log(finalAccounts);
      await axios.post(`http://${address}:8000/accounts/add-accounts`, {
          email: email, 
          accounts: finalAccounts,
      })
      .then(function (response) {
        console.log(response.data);
        getAccounts();
    })
    .catch(function (error) {
        console.error(error);
    });
  }, [email]);

  const getAccounts = async () => {
    console.log("getting accounts");
    await axios
    .get(`http://${address}:8000/accounts/get-accounts`, {
        params: { email: email },
    })
    .then(function (response) {
        let userAccounts = response.data.accounts
        console.log(userAccounts);
        setAccounts(userAccounts);
        setRefresh(true);
    })
    .catch(function (error) {
        console.error(error);
    });
  };

  useEffect(() => {
    getAccounts();
  },[])

  useEffect(() => {
    if (linkToken == null) {
      createLinkToken();
    }
  }, [linkToken]);

  const handlePressAccount = (item: any) => {
    console.log(item.balances)
    navigation.navigate('AccountInfo', {item}, accounts);
  };

  type ItemProps = {
    name: string;
    onPress: ()=> void;
  };

  const Account = ({name, onPress}: ItemProps) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.flatListItem}>
        <Text style={styles.flatListItemText}>{name}</Text>
      </View>
    </TouchableOpacity>
    
  );

  const renderItem = ({item}) => (
    <Account 
      name={item.name} 
      onPress={()=>{handlePressAccount(item)}}
    />
  );

  return (
    <SafeAreaView style={styles.flatListContainer}>
        <FlatList
          data={accounts}
          renderItem={renderItem}
          keyExtractor={item => item.account_id}
          extraData={refresh}
        />
        <PlaidLink
          tokenConfig={{
            token: linkToken,
            noLoadingState: false,
          }}
          onSuccess={async (success: LinkSuccess) => {
            await fetch(`http://${address}:8000/api/exchange_public_token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({public_token: success.publicToken}),
            }).catch(err => {
              console.log(err);
            });
            addNewAccounts();
          }}
          onExit={(response: LinkExit) => {
            console.log(response);
          }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Account</Text>
          </View>
        </PlaidLink>
      <FooterList/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
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
    mainButton: {
      width: 350,
      backgroundColor: COLORS.primary,
    },
    item: {
      color: COLORS.primary,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    buttonContainer: {
      elevation: 4,
      backgroundColor: COLORS.primary,
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    buttonText: {
      fontSize: 15,
      color: '#FFF',
      backgroundColor: COLORS.primary,
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
    flatListContainer: {
      flex: 1,
      backgroundColor: '#FFFF',
      width: '100%',
    },
    flatListItem: {
      backgroundColor: COLORS.lightGreen,
      padding: 20,
      marginVertical: 15,
      marginHorizontal: 16,
    },
    flatListItemText: {
      fontSize: 20,
      color: '#000000',
      fontWeight: 'bold',
      alignSelf: 'center',
    },
  });
