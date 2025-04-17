import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Vibration,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Image } from "react-native";
import Colors from "./../../constant/Colors";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "../../context/UserDetailContext";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Audio from "expo-av";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [recording, setRecording] = useState();
  const [audioPermission, setAudioPermission] = useState(false);
  const [activeInputField, setActiveInputField] = useState(null);

  useEffect(() => {
    if (textToSpeechEnabled) {
      speak("Create a new account. Please enter your full name, email, and password to sign up.");
    }
  }, [textToSpeechEnabled]);

  useEffect(() => {
    getPermissions();
  }, []);

  async function getPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    setAudioPermission(status === "granted");
  }

  const CreateNewAccount = () => {
    setLoading(true);
    Vibration.vibrate(100);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await SaveUser(user);
        setLoading(false);
        router.replace("/(tabs)/home");
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
        speak("Error creating account. Please check your information and try again.");
        ToastAndroid.show("Error creating account", ToastAndroid.BOTTOM);
      });
  };

  const SaveUser = async (user) => {
    const data = {
      name: fullName,
      email: email,
      member: false,
      uid: user?.uid,
    };
    await setDoc(doc(db, "users", email), data);
    setUserDetail(data);
  };

  const speak = (text) => {
    if (textToSpeechEnabled) {
      Speech.speak(text);
    }
  };

  async function startRecording() {
    if (!audioPermission) {
      await getPermissions();
      if (!audioPermission) {
        alert("Please grant audio permission to use this feature.");
        return;
      }
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setLoading(true);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Audio = reader.result.split(",")[1]; // Extract base64
      try {
        const backendResponse = await fetch("YOUR_BACKEND_URL/speech-to-text", {
          // Replace with your backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioBytes: base64Audio }),
        });
        const data = await backendResponse.json();
        if (activeInputField === "fullName") {
          setFullName(data.transcription);
          speak("Full name entered.");
        } else if (activeInputField === "email") {
          setEmail(data.transcription);
          speak("Email entered.");
        } else if (activeInputField === "password") {
          setPassword(data.transcription);
          speak("Password entered.");
        } else if (data.transcription.toLowerCase().includes("create account")) {
          speak("Creating account.");
          CreateNewAccount();
        }
        setLoading(false);
      } catch (error) {
        console.error("Error sending audio to backend", error);
        setLoading(false);
      }
    };
    reader.readAsDataURL(blob);
    setRecording(undefined);
  }

  const handleVoiceCommand = async (field) => {
    setActiveInputField(field);
    speak(`Please say your ${field}.`);
    await startRecording();
    setTimeout(async () => {
      await stopRecording();
    }, 3000); // 3 seconds recording time. Adjust as needed.
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: Colors.BLACK,
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingTop: 50,
              padding: 25,
              paddingBottom: 50, // Extra padding at bottom
            }}
          >
            <TouchableOpacity
              onPress={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
                gap: 10,
                padding: 14,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: Colors.BG_GRAY,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "outfit-bold",
                  textAlign: "center",
                }}
              >
                Vision Impaired
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  padding: 4,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={textToSpeechEnabled ? "mic" : "mic-off"}
                  size={30}
                  color={textToSpeechEnabled ? Colors.PRIMARY : "gray"}
                />
              </View>
            </TouchableOpacity>

            <Image
              source={require("./../../assets/images/logo.png")}
              style={{ width: 150, height: 150,
                borderRadius: 30, marginTop: 15,
                marginBottom: 15
               }}
            />

            <Text style={{ fontSize: 30, fontFamily: "outfit-bold", color: Colors.WHITE }}>
              Create New Account
            </Text>

            <View style={{ width: "100%" }}>
              <TextInput
                placeholder="Full Name"
                onFocus={() => speak("Full Name input field")}
                onChangeText={(value) => setFullName(value)}
                style={styles.textInput}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.emailInput.focus();
                }}
              />
            </View>

            <View style={{ width: "100%" }}>
              <TextInput
                ref={(input) => {
                  this.emailInput = input;
                }}
                placeholder="Email"
                onFocus={() => speak("Email input field")}
                onChangeText={(value) => setEmail(value)}
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.passwordInput.focus();
                }}
              />
            </View>

            <View style={{ width: "100%" }}>
              <TextInput
                ref={(input) => {
                  this.passwordInput = input;
                }}
                placeholder="Password"
                onFocus={() => speak("Password input field")}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}
                style={styles.textInput}
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                speak("Create Account button clicked");
                CreateNewAccount();
              }}
              disabled={loading}
              style={{
                padding: 15,
                backgroundColor: Colors.BG_GRAY,
                width: "100%",
                marginTop: 25,
                borderRadius: 10,
              }}
            >
              {!loading ? (
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 20,
                    color: Colors.BLACK,
                    textAlign: "center",
                  }}
                >
                  Create Account
                </Text>
              ) : (
                <ActivityIndicator size={"large"} color={Colors.WHITE} />
              )}
            </TouchableOpacity>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  color: Colors.WHITE,
                }}
              >
                Already have an account?
              </Text>
              <Pressable onPress={() => {router.push("./../auth/signIn"), speak("Directing to Sign In page")}}>
                <Text
                  style={{
                    color: Colors.PRIMARY,
                    fontFamily: "outfit-bold",
                  }}
                >
                  Sign In Here
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: Colors.GRAY,
    color: Colors.WHITE,
  },
});