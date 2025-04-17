import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { PraticeOption } from "../../constant/Option";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import * as Speech from 'expo-speech';

export default function PracticeSection({ onPracticePress }) {
  const router = useRouter();
  
  const handlePracticeItemPress = (item) => {
    // Stop any ongoing speech
    Speech.stop();
    
    // Create speech text based on the practice item name
    const speechText = `Clicked on ${item.name}. Opening ${item.name} section.`;
    
    // Use text-to-speech to announce the action
    Speech.speak(speechText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => {
        console.log("Speech started for practice item:", item.name);
      },
      onError: (error) => {
        console.log("Speech error:", error);
      }
    });
    
    // Call the parent component's onPracticePress if provided
    if (onPracticePress) {
      onPracticePress(item);
    }
    
    // Navigate after a short delay to allow TTS to begin
    setTimeout(() => {
      router.push("/practice/" + item.name);
    }, 300);
  };

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      
      <FlatList
        data={PraticeOption}
        numColumns={3}
        style={{
          backgroundColor: Colors.GRAY,
          borderRadius: 20
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handlePracticeItemPress(item)}
            key={index}
            style={{
              flex: 1,
              margin: 5,
              aspectRatio: 1,
              borderWidth: 0,  // Default no border
              borderColor: 'transparent',
              borderRadius: 15,
            }}
            activeOpacity={0.7}
          >
            <Image
              source={item?.image}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 160,
                borderRadius: 15,
              }}
            />
            
            <Text
              style={{
                position: "absolute",
                padding: 15,
                fontSize: 15,
                fontFamily: "outfit",
                color: Colors.WHITE,
              }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}