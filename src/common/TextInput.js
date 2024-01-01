import React, { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
} from "react-native";

import * as Colors from "../config/colors";

/* =============================================================================
<TextInput />
============================================================================= */
const TextInput = ({
  left,
  right,
  label,
  value,
  errorText,
  editable,
  disabled,
  placeholder,
  labelStyle,
  inputStyle,
  containerStyle,
  contentContainerStyle,
  onPress,
  onChange,
  ...props
}) => {
  const _textInput = useRef();

  const _handleChange = (inputValue) => {
    if (typeof onChange === "function") {
      onChange(inputValue);
    }
  };

  const _handlePress = (e) => {
    if (typeof onPress === "function") {
      onPress(e);
    } else if (_textInput.current && editable) {
      _textInput.current.focus();
    }
  };

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      disabled={disabled}
      onPress={_handlePress}
    >
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.content,
          !!errorText && styles.error,
          contentContainerStyle,
        ]}
      >
        {left}
        <RNTextInput
          ref={_textInput}
          value={value}
          style={[
            styles.input,
            left && styles.inputWithLeft,
            right && styles.inputWithRight,
            inputStyle,
          ]}
          editable={editable}
          selectionColor="#8A93A0"
          placeholderTextColor={Colors.placeholder}
          placeholder={placeholder}
          onChangeText={_handleChange}
          {...props}
        />
        {right}
      </View>
      {Boolean(errorText) && <Text style={styles.errorTxt}>{errorText}</Text>}
    </Pressable>
  );
};

TextInput.defaultProps = {
  editable: true,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 25,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: "Poppins-Medium",
    color: "#2A3037",
  },
  content: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#999",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
  },
  error: {
    borderWidth: 1.2,
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 13,
    paddingHorizontal: 0,
    color: Colors.grey3,
  },
  inputWithLeft: {
    marginLeft: 14,
  },
  inputWithRight: {
    marginRight: 14,
  },
  errorTxt: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 5,
    marginLeft: 5,
  },
});

/* Export
============================================================================= */
export default TextInput;
