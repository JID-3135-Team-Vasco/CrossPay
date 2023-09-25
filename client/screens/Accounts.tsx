import React from 'react';
import {StyleSheet, Text, View, Alert, FlatList} from 'react-native';
import {Button} from 'react-native-elements';
import {COLORS} from './Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';



const styles = StyleSheet.create({
    container: {
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
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 25
    },
  });



export function Accounts({navigation}): React.ReactElement {

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={styles.buttonContainer}>
                <Button 
                    title="Add Account"
                    style={styles.mainButton}
                    buttonStyle={styles.mainButton}
                />

            </View>
        </KeyboardAwareScrollView>
    );
}



