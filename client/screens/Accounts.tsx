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


export function Accounts({navigation}: any): React.ReactElement {
  const [linkToken, setLinkToken] = useState(null);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const address = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

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
  const getAccounts = useCallback(async () => {
    await fetch(`http://${address}:8000/api/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        let finalAccounts = accounts;
        let newAccounts = data.accounts.accounts;
        newAccounts.forEach((account: any) => {
          return finalAccounts.push(account);
        });
        setAccounts(finalAccounts);
        setRefresh(!refresh);
      })
      .catch(err => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (accounts == null && success) {
      getAccounts();
      console.log(accounts)
    }
  }, [accounts]);

  useEffect(() => {
    if (linkToken == null) {
      createLinkToken();
    }
  }, [linkToken]);

  type ItemProps = {name: string};
  const Account = ({name}: ItemProps) => (
    <View style={styles.flatListItem}>
      <Text style={styles.flatListItemText}>{name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.flatListContainer}>
        <FlatList
          data={accounts}
          renderItem={({item}) => <Account name={item.name} />}
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
            setSuccess(true);
            getAccounts();
          }}
          onExit={(response: LinkExit) => {
            console.log(response);
          }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Add Account</Text>
          </View>
        </PlaidLink>
      <FooterList />
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
      backgroundColor: COLORS.secondary,
      padding: 20,
      marginVertical: 15,
      marginHorizontal: 16,
    },
    flatListItemText: {
      fontSize: 15,
      color: '#00000',
      fontWeight: 'bold',
      alignSelf: 'center',
    },
  });
