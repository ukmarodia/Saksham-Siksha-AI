import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "./../../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Colors from "../../constant/Colors";
import CourseList from "../Home/CourseList";

export default function CourseListByCategory({ category }) {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseListByCategory();
  }, []);

  const getCourseListByCategory = async () => {
    try {
      setCourseList([]);
      setLoading(true);
      
      const q = query(
        collection(db, "Courses"),
        where("category", "==", category)
      );
      
      const querySnapshot = await getDocs(q);
      const courses = [];
      
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });
      
      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if no courses found
  if (!loading && courseList.length === 0) {
    return null;
  }

  return (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 22,
          color: Colors.WHITE,
          marginBottom: 10,
        }}
      >
        {category}
      </Text>
      
      {loading ? (
        <ActivityIndicator color={Colors.WHITE} />
      ) : (
        <CourseList courseList={courseList} />
      )}
    </View>
  );
}