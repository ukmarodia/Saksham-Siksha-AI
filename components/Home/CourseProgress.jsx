import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "../../constant/Colors";
import CourseProgressCard from "../shared/CourseProgressCard";
import * as Speech from 'expo-speech';
import { Ionicons } from "@expo/vector-icons";

export default function CourseProgress({ courseList, onProgressItemPress }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleProgressItemPress = (item) => {
    if (onProgressItemPress) {
      onProgressItemPress(item);
    }
  };

  const speakProgressOverview = () => {
    // Stop any previous speech
    Speech.stop();

    // If we're already speaking, just stop
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Set speaking state
    setIsSpeaking(true);

    // Calculate overall statistics
    const totalCourses = courseList.length;
    
    if (totalCourses === 0) {
      const noCoursesMessage = "You don't have any courses yet. Create a course to start tracking your progress.";
      Speech.speak(noCoursesMessage, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
      return;
    }
    
    const completedCourses = courseList.filter(course => 
      course.completedChapter && course.chapters && 
      course.completedChapter.length === course.chapters.length
    ).length;
    
    const inProgressCourses = totalCourses - completedCourses;
    
    // Calculate average progress across all courses
    let totalProgress = 0;
    courseList.forEach(course => {
      if (course.completedChapter && course.chapters && course.chapters.length > 0) {
        totalProgress += (course.completedChapter.length / course.chapters.length) * 100;
      }
    });
    
    const avgProgress = totalProgress > 0 ? Math.round(totalProgress / totalCourses) : 0;
    
    // Prepare speech text
    const speechText = `Progress overview: You have ${totalCourses} total ${totalCourses === 1 ? 'course' : 'courses'}. 
      ${completedCourses} ${completedCourses === 1 ? 'course is' : 'courses are'} completed and 
      ${inProgressCourses} ${inProgressCourses === 1 ? 'is' : 'are'} in progress. 
      Your average course completion is ${avgProgress}%. 
      Tap on any course card to see detailed progress for that specific course.`;

    // Speak the text
    Speech.speak(speechText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={speakProgressOverview}
           style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <TouchableOpacity 
          onPress={speakProgressOverview}
          style={[styles.speakButton, isSpeaking && styles.activeButton]}
          accessibilityLabel="Speak progress overview"
        >
          <Ionicons 
            name={isSpeaking ? "volume-high" : "volume-medium"} 
            size={24} 
            color={Colors.PRIMARY} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <FlatList
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.flatList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProgressItemPress(item)}
          >
            <CourseProgressCard item={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE
  },
  flatList: {
    backgroundColor: Colors.GRAY,
    borderRadius: 20
  },
  speakButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  emptyText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    textAlign: 'center'
  }
});