import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { imageAssets } from "../../constant/Option";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import Button from "../shared/Button";
import { useRouter } from "expo-router";

export default function Intro({ course }) {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Image
        source={imageAssets[course?.banner_image]}
        style={styles.bannerImage}
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.courseTitle}>
          {course?.courseTitle}
        </Text>
        
        <View>
          <View style={styles.chapterInfo}>
            <Ionicons name="book-outline" size={20} color={Colors.WHITE} />
            <Text style={styles.chapterCount}>
              {course?.chapters?.length} Chapters
            </Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>
          Description:
        </Text>
        
        <Text style={styles.description}>
          {course?.description}
        </Text>
        
        <Button text={"Start Now"} onPress={() => console.log("")} />
      </View>
      
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={34} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: 280,
  },
  contentContainer: {
    width: "100%",
    padding: 15,
  },
  courseTitle: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    color: Colors.WHITE,
    marginBottom: 10,
  },
  chapterInfo: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 5,
  },
  chapterCount: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.WHITE,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginTop: 15,
    color: Colors.WHITE,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.GRAY,
    marginTop: 5,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
});