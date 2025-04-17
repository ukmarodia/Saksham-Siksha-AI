import { 
  Image, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Vibration,
  ToastAndroid
} from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import * as Speech from "expo-speech";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle text-to-speech
  const speak = (text) => {
    if (textToSpeechEnabled) {
      Speech.speak(text);
    }
  };

  // Speak welcome message when text-to-speech is enabled
  useEffect(() => {
    if (textToSpeechEnabled) {
      speak("Welcome to Saksham Siksha. Empowering Education, Enabling Abilities with AI – Making Learning Accessible for All!");
    }
  }, [textToSpeechEnabled]);

  // Wrapping the auth state listener in useEffect to prevent it from re-registering on every render.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        try {
          console.log(user);
          const result = await getDoc(doc(db, 'users', user?.email));
          setUserDetail(result.data());
          if (textToSpeechEnabled) {
            speak("Welcome back! Redirecting to home page.");
          }
          router.replace('./(tabs)/home');
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (textToSpeechEnabled) {
            speak("There was an error loading your profile.");
          }
          ToastAndroid.show("Error loading profile", ToastAndroid.BOTTOM);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    Vibration.vibrate(200);
    speak("Getting started. Redirecting to sign up page.");
    router.push("./auth/signUp");
  };

  const handleSignIn = () => {
    Vibration.vibrate(200);
    speak(" Already have an Account? Redirecting to sign in page.");
    router.push("./auth/signIn");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#b7b4b4',
      }}
    >
      

      <Image
        source={require("./../assets/images/landing.png")}
        style={{
          width: '100%',
          height: 300,
          marginTop: 20,
          padding: 15,
          
         
        }}
        accessible={true}
        accessibilityLabel="Saksham Siksha landing image"
      />
      <View
        style={{
          padding: 25,
          backgroundColor: Colors.BLACK,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          
          
        }}
      >
        <TouchableOpacity
          onPress={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
          style={styles.hearButton}
          accessible={true}
          accessibilityLabel="Toggle speech assistance"
          accessibilityHint="Turns on or off voice guidance for this screen"
        >
          <Text
            style={{
              fontSize: 22,
              fontFamily: "outfit-bold",
              textAlign: "center",
              color: Colors.BLACK,
              gap: 10
            }}
          >
            Vision Impaired
          </Text>
          
          <View style={styles.micIconContainer}>
            <Ionicons
              name={textToSpeechEnabled ? "mic" : "mic-off"}
              size={30}
              color={textToSpeechEnabled ? Colors.PRIMARY : "gray"}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-bold",
          }}
          accessible={true}
          accessibilityLabel="Welcome to Saksham Siksha"
        >
          WELCOME TO SAKSHAM SIKSHA
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
            color: Colors.WHITE,
            marginTop: 20,
          }}
          accessible={true}
          accessibilityLabel="Empowering Education, Enabling Abilities with AI – Making Learning Accessible for All!"
        >
          Empowering Education, Enabling Abilities with AI – Making Learning Accessible for All! 🚀📚
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          accessible={true}
          accessibilityLabel="Get Started button"
          accessibilityHint="Creates a new account"
        >
          <Text style={[styles.buttonText, { color: Colors.BLACK }]}>
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.GRAY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
          onPress={handleSignIn}
          accessible={true}
          accessibilityLabel="Already have an Account? button"
          accessibilityHint="Goes to sign in page"
        >
          <Text
            style={[
              styles.buttonText,
              { color: Colors.BLACK, fontFamily: "outfit" },
            ]}
          >
            Already have an Account?
          </Text>
        </TouchableOpacity>
        
        
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "outfit",
  },
  accessibilityContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 25,
  },
  hearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20
  },
  micIconContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }
});