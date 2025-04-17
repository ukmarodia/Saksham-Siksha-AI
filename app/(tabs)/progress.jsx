import { View, Text, FlatList, TouchableOpacity, Switch } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import CourseProgressCard from "../../components/shared/CourseProgressCard";
import { db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech"; // Import Speech from expo-speech

export default function Progress() {
  const route = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false); // State to track if TTS is enabled
  const [progressText, setProgressText] = useState(""); // State to store progress text

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    const q = query(
      collection(db, "courses"),
      where("createdBy", "==", userDetail?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log("--", doc.data());
      setCourseList((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
    
    // Generate progress summary text
    generateProgressSummary();
  };

  // Function to generate progress summary text
  const generateProgressSummary = () => {
    if (courseList.length === 0) {
      setProgressText("No courses found. Start creating courses to track your progress.");
      return;
    }
    
    const completedCourses = courseList.filter(course => (course.progress || 0) === 100).length;
    const averageProgress = courseList.reduce((sum, course) => sum + (course.progress || 0), 0) / courseList.length;
    
    const summaryText = `You have ${courseList.length} courses. ${completedCourses} completed. Average progress: ${averageProgress.toFixed(1)}%`;
    setProgressText(summaryText);
    
    return summaryText;
  };

  // Function to speak course progress
  const speakProgress = (course) => {
    if (!ttsEnabled) return;
    
    const progressText = `Course: ${course.name}. Progress: ${course.progress || 0}%. ${course.description || ''}`;
    Speech.speak(progressText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9, // Slightly slower for better comprehension
    });
  };

  // Function to speak summary of all courses
  const speakSummary = () => {
    if (!ttsEnabled || courseList.length === 0) return;
    
    const summaryText = generateProgressSummary();
    if (!summaryText) return;
    
    Speech.speak(summaryText, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Speak summary when TTS is enabled and course list changes
  useEffect(() => {
    if (courseList.length > 0 && !loading) {
      generateProgressSummary();
      
      if (ttsEnabled) {
        speakSummary();
      }
    }
  }, [ttsEnabled, courseList, loading]);

  return (
    <View style={{
      backgroundColor: Colors.BLACK,
      height: '100%'
    }}>
      <View
        style={{
          padding: 20,
          width: '100%',
          position: 'absolute',
          backgroundColor: Colors.BLACK
        }}
      >
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 30,
          color: Colors.WHITE,
          marginBottom: 10
        }}>
          Course Progress
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10
        }}>
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 16,
            color: Colors.WHITE,
            marginRight: 10
          }}>
            Vision Impaired
          </Text>
          <Switch
            value={ttsEnabled}
            onValueChange={(value) => {
              setTtsEnabled(value);
              if (!value) {
                Speech.stop();
              } else if (courseList.length > 0) {
                speakSummary();
              }
            }}
            trackColor={{ false: Colors.GRAY, true: Colors.PRIMARY }}
            thumbColor={ttsEnabled ? Colors.WHITE : Colors.LIGHT_GRAY}
          />
        </View>
        
        {/* Progress Text Display */}
        <View style={{
          backgroundColor: Colors.GRAY,
          borderRadius: 10,
          padding: 15,
          marginVertical: 10
        }}>
          <Text style={{
            fontFamily: 'outfit-medium',
            fontSize: 16,
            color: Colors.WHITE,
            lineHeight: 22
          }}>
            {progressText}
          </Text>
        </View>
        
        {/* TTS Toggle Switch */}
       
        
        <View style={{
          backgroundColor: Colors.GRAY,
          borderRadius: 20,
          marginTop: 20
        }}>
          <FlatList
            data={courseList}
            showsVerticalScrollIndicator={false}
            onRefresh={() => GetCourseList()}
            refreshing={loading}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                onPress={() => {
                  // Speak the course details when pressed if TTS enabled
                  speakProgress(item);
                  
                  route.push({
                    pathname: '/courseView/' + item?.docId,
                    params: {
                      courseParams: JSON.stringify(item)
                    }
                  });
                }}
              >
                <CourseProgressCard item={item} width={'96%'} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}