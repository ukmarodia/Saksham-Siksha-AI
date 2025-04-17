import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import { imageAssets } from "../../constant/Option";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from 'expo-speech';

export default function CourseProgressCard({ item, width = 280, onCardPress, isActiveCard = false }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Calculate the completion percentage
  const GetCompletedChapters = (course) => {
    if (!course || !course.completedChapter || !course.chapters) return 0;
    const completedChapter = course.completedChapter.length || 0;
    const totalChapters = course.chapters.length || 1; // Avoid division by zero
    return completedChapter / totalChapters;
  };
  
  // Calculate percentage for display
  const completionPercentage = Math.round(GetCompletedChapters(item) * 100);
  
  // Get completed and total chapters with null checks
  const completedChapters = item?.completedChapter?.length || 0;
  const totalChapters = item?.chapters?.length || 0;
  
  // Handle card press
  const handlePress = () => {
    // Call the onCardPress callback if provided
    if (onCardPress) {
      onCardPress(item);
    }
    
    // Create speech text with proper null checks
    const speechText = `${item?.courseTitle || 'Course'}. You have completed ${completedChapters} out of ${totalChapters} chapters. Your progress is ${completionPercentage} percent.`;
    
    // Stop any existing speech
    Speech.stop();
    
    // Set speaking state
    setIsSpeaking(true);
    
    // Check if Speech is available
    console.log("Starting speech with text:", speechText);
    
    // Speak with callbacks
    Speech.speak(speechText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onStart: () => {
        console.log("Speech started");
        setIsSpeaking(true);
      },
      onDone: () => {
        console.log("Speech finished");
        setIsSpeaking(false);
      },
      onStopped: () => {
        console.log("Speech stopped");
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.log("Speech error:", error);
        setIsSpeaking(false);
      }
    });
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        console.log("Stopping speech on unmount");
        Speech.stop();
        setIsSpeaking(false);
      }
    };
  }, [isSpeaking]);
    
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { width: width },
        (isActiveCard || isSpeaking) && styles.activeContainer
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image
          source={imageAssets[item?.banner_image]}
          style={styles.thumbnail}
          defaultSource={require('./../../assets/images/banner1.png')} // Add a default image
        />
        <View style={styles.headerTextContainer}>
          <Text
            numberOfLines={2}
            style={styles.courseTitle}
          >
            {item?.courseTitle || 'Course Title'}
          </Text>
          <Text style={styles.chaptersText}>
            {totalChapters} Chapters
          </Text>
        </View>
        {isSpeaking && (
          <View style={styles.speakingIndicator}>
            <Ionicons name="volume-high" size={18} color={Colors.PRIMARY} />
          </View>
        )}
      </View>
      <View style={styles.progressContainer}>
        <Progress.Bar 
          progress={GetCompletedChapters(item)}
          width={width - 30}
          color={Colors.PRIMARY}
          unfilledColor="rgba(255,255,255,0.1)"
          borderWidth={0}
          height={8}
        />
        <View style={styles.progressDetails}>
          <Text style={styles.completionText}>
            {completedChapters} out of {totalChapters} Chapters Completed
          </Text>
          <Text style={styles.percentageText}>
            {completionPercentage}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 7,
    padding: 15,
    backgroundColor: Colors.BLACK,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  activeContainer: {
    borderColor: Colors.PRIMARY,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  cardHeader: {
    flexDirection: "row",
    gap: 8,
    position: 'relative'
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8
  },
  headerTextContainer: {
    flex: 1
  },
  courseTitle: {
    fontFamily: "outfit-bold",
    fontSize: 17,
    flexWrap: "wrap",
    color: Colors.WHITE
  },
  chaptersText: {
    fontFamily: "outfit",
    fontSize: 15,
    color: Colors.WHITE
  },
  progressContainer: {
    marginTop: 10
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  completionText: {
    fontFamily: "outfit",
    color: Colors.WHITE,
    fontSize: 14
  },
  percentageText: {
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    fontSize: 14
  },
  speakingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4
  }
});