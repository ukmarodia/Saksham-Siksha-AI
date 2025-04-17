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
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Image } from "react-native";
import Colors from "./../../constant/Colors";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserDetailContext } from "../../context/UserDetailContext";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";

export default function SignIn() {
  const router = useRouter();
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
      speak("Welcome Back. Please enter your email and password to sign in.");
    }
  }, [textToSpeechEnabled]);

  useEffect(() => {
    getPermissions();
  }, []);

  async function getPermissions() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      setAudioPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting audio permissions:", error);
      ToastAndroid.show("Failed to get audio permissions", ToastAndroid.BOTTOM);
    }
  }

  const onSignInClick = () => {
    setLoading(true);
    Vibration.vibrate(100);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await getUserDetail();
        setLoading(false);
        router.replace("/(tabs)/home");
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        speak("Incorrect Email and Password. Enter Correct Credentials");
        ToastAndroid.show("Incorrect Email & Password", ToastAndroid.BOTTOM);
      });
  };

  const getUserDetail = async () => {
    const result = await getDoc(doc(db, "users", email));
    console.log(result.data());
    setUserDetail(result.data());
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
        if (activeInputField === "email") {
          setEmail(data.transcription);
          speak("Email entered.");
        } else if (activeInputField === "password") {
          setPassword(data.transcription);
          speak("Password entered.");
        } else if (data.transcription.toLowerCase().includes("sign in")) {
          speak("Signing in.");
          onSignInClick();
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
              display: "flex",
              alignItems: "center",
              paddingTop: 50,
              flex: 1,
              backgroundColor: Colors.BLACK,
              padding: 25,
            }}
          >
            <Text
              style={{
                position: "relative",
              }}
            >
              <TouchableOpacity
                onPress={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center", // Center items horizontally
                  marginTop: 5,
                  gap: 10, // Adjust spacing
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
                    justifyContent: "center", // Center icon inside
                  }}
                >
                  <Ionicons
                    name={textToSpeechEnabled ? "mic" : "mic-off"}
                    size={30}
                    color={textToSpeechEnabled ? Colors.PRIMARY : "gray"}
                  />
                </View>
              </TouchableOpacity>
            </Text>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={{ width: 150, height: 150,
                borderRadius: 30, marginTop: 15,
                marginBottom: 15
               }}
            />

            <Text
              style={{
                fontSize: 30,
                fontFamily: "outfit-bold",
                color: Colors.WHITE,
              }}
            >
              Welcome Back
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Email"
                onFocus={() => speak("Email input field")}
                onChangeText={(value) => setEmail(value)}
                style={styles.textInput}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Password"
                onFocus={() => speak("Password input field")}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}
                style={styles.textInput}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                speak("Sign In button clicked");
                onSignInClick();
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
                  Sign In
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
                Don't have an account?
              </Text>
              <Pressable
                onPress={() => {
                  router.push("./../auth/signUp"),
                    speak("Directing to SignUp page");
                }}
              >
                <Text
                  style={{
                    color: Colors.PRIMARY,
                    fontFamily: "outfit-bold",
                  }}
                >
                  Sign Up Here
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