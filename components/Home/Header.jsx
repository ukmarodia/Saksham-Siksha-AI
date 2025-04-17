import { View, Text, TouchableOpacity } from "react-native"; 
import React, { useContext, useState } from "react"; 
import { UserDetailContext } from "../../context/UserDetailContext"; 
import Ionicons from "@expo/vector-icons/Ionicons"; 
import Colors from "../../constant/Colors";
import * as Speech from 'expo-speech';  

export default function Header({ onHeaderPress }) {   
  const { userDetail, setUserDetail } = useContext(UserDetailContext);      
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleHeaderPress = () => {     
    // Text-to-speech functionality
    Speech.speak(`Hello, ${userDetail?.name}. Let's Get Started!`);
    
    if (onHeaderPress) {       
      onHeaderPress();     
    }   
  };    
  
  return (     
    <TouchableOpacity        
      style={{         
        display: 'flex',         
        flexDirection: 'row',         
        justifyContent: 'space-between',         
        alignItems: 'center',         
        backgroundColor: Colors.BLACK,         
        flex: 1       
      }}       
      onPress={handleHeaderPress}     
    >       
      <View>         
        <Text           
          style={{             
            fontFamily: "outfit-bold",             
            fontSize: 25,             
            color: Colors.WHITE           
          }}         
        >           
          Hello, {userDetail?.name}         
        </Text>         
        <Text           
          style={{             
            fontFamily: "outfit",             
            fontSize: 17,             
            color: Colors.BG_GRAY           
          }}         
        >           
          Let's Get Started!         
        </Text>       
      </View>
      <Ionicons 
            name={isSpeaking ? "volume-high" : "volume-medium"} 
            size={24} 
            color={Colors.PRIMARY} 
          />  
    </TouchableOpacity>   
  ); 
}