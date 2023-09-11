import React, { useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        email: "test",
    });

    useEffect(() => {
        const loadFromAsyncStorage = async () => {
            let data = await AsyncStorage.getItem("res-Email");
            const parsed = JSON.parse(data);
            setState({...state, email: parsed.email});
        };
        loadFromAsyncStorage();
    }, []);

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );

};

export { AuthContext, AuthProvider };