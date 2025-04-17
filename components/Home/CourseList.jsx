import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { imageAssets } from "../../constant/Option";
import Colors from "../../constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
 
export default function CourseList({ courseList, heading = "Courses", onCoursePress }) {
  const router = useRouter();
  
  const handleCoursePress = (course) => {
    // Call the TTS function first
    if (onCoursePress) {
      onCoursePress(course);
    }
    
    // Navigate after a short delay to allow TTS to begin
    setTimeout(() => {
      router.push({
        pathname: '/courseView/' + course?.docId,
        params: {
          courseParams: JSON.stringify(course)
        }
      });
    }, 300);
  };

  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <FlatList
        data={courseList}
        horizontal={true}
        style={{
          backgroundColor: Colors.GRAY,
          borderRadius: 20,
          width: '100%'
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleCoursePress(item)}
            key={index} 
            style={styles.courseContainer}
          >
            <Image
              source={imageAssets[item.banner_image]}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 15,
              }}
            />
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 18,
                marginTop: 10,
                color: Colors.WHITE
              }}
            >
              {item?.courseTitle}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Ionicons name="book-outline" size={20} color={Colors.WHITE} />
              <Text
                style={{
                  fontFamily: "outfit",
                  color: Colors.WHITE
                }}
              >
                {item?.chapters?.length} Chapters
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  courseContainer: {
    padding: 10,
    backgroundColor: Colors.BLACK,
    margin: 6,
    borderRadius: 15,
    width: 240,
  },
});