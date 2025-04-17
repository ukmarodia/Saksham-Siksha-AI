import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "../../constant/Colors";

export default function Button({ text, type = "fill", onPress, loading }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        width: "100%",
        borderRadius: 15,
        marginTop: 15,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        color: Colors.BLACK,
        backgroundColor: type == "fill" ? Colors.BG_GRAY : Colors.WHITE,
      }}
      disabled={loading}
    >
      {!loading ? (
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            color: type == "fill" ? Colors.BLACK : Colors.BLACK,
          }}
        >
          {text}
        </Text>
      ) : (
        <ActivityIndicator
          size={"small"}
          color={type == "fill" ? Colors.GRAY : Colors.GRAY}
        />
      )}
    </TouchableOpacity>
  );
}
