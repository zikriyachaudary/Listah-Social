import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AppColors, normalized } from "../util/AppConstant";

const TextInputComponent = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={{ marginVertical: normalized(5) }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor:
            props?.value.length > 0 || props?.error?.length > 0 || isFocused
              ? "#6d14c4"
              : "darkgrey",
          width: "90%",
          height: normalized(50),
          alignSelf: "center",
          borderRadius: normalized(12),
          paddingHorizontal: normalized(15),
        }}
        maxLength={props?.maxLength ? props?.maxLength : 200}
        value={props?.value}
        onBlur={() => setIsFocused(false)}
        onFocus={() => {
          setIsFocused(true);
        }}
        placeholder={props?.placeholder}
        onChangeText={(val) => {
          props?.setValue(val);
        }}
      />
      {(props?.value.length == 0 && isFocused) || props?.error?.length > 0 ? (
        <Text
          style={{
            marginHorizontal: normalized(20),
            marginTop: normalized(3),
            color: AppColors.blue.navy,
          }}
        >
          !Empty Field
        </Text>
      ) : (
        <View style={{ marginVertical: normalized(10) }} />
      )}
    </View>
  );
};
export default TextInputComponent;
