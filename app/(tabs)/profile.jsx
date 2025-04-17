import { View, Text, Image, TouchableOpacity, Switch, Alert, Platform } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "../../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { UserDetailContext } from "../../context/UserDetailContext";
import Colors from "../../constant/Colors";
import { signOut } from "firebase/auth";
import * as Speech from 'expo-speech';

export default function Profile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [error, setError] = useState('');
  
  // Debug function
  const logVoiceState = () => {
    console.log('Voice State:', {
      voiceEnabled,
      isListening,
      recognizedText,
      isProcessingCommand,
      error
    });
  };
  
  // Mock voice recognition since we can't use actual speech recognition
  // This simulates what would happen when voice commands are spoken
  const simulateVoiceRecognition = (command) => {
    if (!voiceEnabled || isProcessingCommand) return;
    
    setIsListening(true);
    setRecognizedText(command);
    
    // Process the command after a brief delay to simulate recognition
    setTimeout(() => {
      setIsListening(false);
      processVoiceCommand(command);
    }, 1500);
  };

  // This function would normally be triggered by voice recognition results
  const processVoiceCommand = (command) => {
    if (isProcessingCommand) return;
    
    // Prevent multiple rapid commands
    setIsProcessingCommand(true);
    
    // Convert to lowercase and remove extra spaces
    const cleanCommand = command.toLowerCase().trim();
    
    console.log('Processing command:', cleanCommand);
    
    // Check for logout commands
    if (cleanCommand.includes('log out') || 
        cleanCommand.includes('logout') || 
        cleanCommand.includes('sign out')) {
      
      speakFeedback('Logging out now');
      setTimeout(() => {
        handleLogout();
      }, 1500);
    } 
    // Check for add course commands
    else if (cleanCommand.includes('add course') || 
             cleanCommand.includes('create course') || 
             cleanCommand.includes('new course')) {
      
      speakFeedback('Navigating to add course');
      setTimeout(() => {
        router.push('/addCourse');
      }, 1500);
    }
    // Help command
    else if (cleanCommand.includes('help') || 
             cleanCommand.includes('commands') || 
             cleanCommand.includes('what can i say')) {
      
      speakFeedback('Available commands are: add course, logout, and help');
    } else {
      speakFeedback('Command not recognized. Try saying help for available commands.');
    }
    
    // Reset processing flag after a delay
    setTimeout(() => {
      setIsProcessingCommand(false);
    }, 2000);
  };

  const speakFeedback = (message) => {
    try {
      Speech.speak(message, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        volume: 1.0
      });
    } catch (error) {
      console.error('Error speaking feedback:', error);
      setError('Speech error: ' + error.message);
    }
  };

  const toggleVoiceCommands = (value) => {
    setVoiceEnabled(value);
    if (value) {
      speakFeedback("Voice command mode is now active. Try saying help for available commands.");
    } else {
      setRecognizedText('');
      setError('');
      setIsListening(false);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserDetail(null);
        router.push("/");
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  // Test voice function with preset commands
  const testVoice = () => {
    if (!voiceEnabled) {
      Alert.alert(
        "Enable Voice Commands",
        "Please enable voice commands first using the toggle switch.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (isListening || isProcessingCommand) {
      // Don't allow new commands while processing
      return;
    }
    
    // Create a simple demo menu for testing voice commands
    Alert.alert(
      "Test Voice Commands",
      "Select a command to simulate:",
      [
        {
          text: "Help",
          onPress: () => simulateVoiceRecognition("help")
        },
        {
          text: "Add Course",
          onPress: () => simulateVoiceRecognition("add course")
        },
        {
          text: "Logout",
          onPress: () => simulateVoiceRecognition("logout")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BLACK }}> 
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
            marginTop: 10,
            padding: 10,
            color: Colors.WHITE,
            marginBottom: 20
          }}
        >
          Profile
        </Text>
        
       
        
        <View
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop:  100,
          }}
        >
          <Image
            source={require("./../../assets/images/logo.png")}
            style={{ width: 150, height: 150,
              borderRadius: 30, marginTop: 1,
              marginBottom: 25
             }}
          />
        </View>

        <View style={{ marginTop: 60 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-bold",
              fontSize: 32,
              color: Colors.WHITE,
              marginTop: 15
            }}
          >
            {userDetail?.name}
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit",
              fontSize: 15,
              color: Colors.WHITE,
            }}
          >
            {userDetail?.email}
          </Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.push("/addCourse")}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                borderWidth: 0.5,
                borderColor: Colors.GRAY,
                paddingVertical: 12,
                paddingHorizontal: 20,
                marginTop: 20,
                backgroundColor: Colors.WHITE,
              }}
            >
              <Ionicons
                name="add-sharp"
                size={30}
                color={Colors.BLACK}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 20,
                  color: Colors.BLACK,
                }}
              >
                Add Course
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={handleLogout}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                borderWidth: 0.5,
                borderColor: Colors.GRAY,
                paddingVertical: 12,
                paddingHorizontal: 20,
                marginTop: 20,
                backgroundColor: Colors.RED,
              }}
            >
              <Ionicons
                name="log-out"
                size={30}
                color={Colors.WHITE}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 20,
                  color: Colors.WHITE,
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}