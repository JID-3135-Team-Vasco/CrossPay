import React from 'react';
import { View, Text } from 'react-native';

export function AccountInfo({route, navigation}: {route: any, navigation: any}): React.ReactElement {
  const { name } = route.params.item;

  return (
    <View>
      <Text>Detail Screen for {name}</Text>
    </View>
  );
};

