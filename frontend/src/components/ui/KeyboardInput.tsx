import Colors from '../../constants/Colors';
import React from 'react';
import {
  View,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

const KeyboardInput = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
          <TextInput
            placeholder="Enter something"
            style={{
              borderWidth: 1,
              borderColor: Colors.graySilver,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KeyboardInput;
