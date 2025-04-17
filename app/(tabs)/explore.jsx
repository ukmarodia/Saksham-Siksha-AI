import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "./../../constant/Colors";
import { CourseCategory } from "./../../constant/Option";
import CourseListByCategory from "../../components/Explore/CourseListByCategory";

export default function Explore() {
  const [loading, setLoading] = useState(true);

  // Add a small delay to ensure Firebase has time to connect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.BLACK,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 30,
          color: Colors.WHITE,
          marginBottom: 15,
        }}
      >
        Explore More Courses
      </Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.WHITE} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {CourseCategory.map((item, index) => (
            <View 
              key={index} 
              style={{
                marginBottom: 25,
              }}
            >
              <CourseListByCategory category={item} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}