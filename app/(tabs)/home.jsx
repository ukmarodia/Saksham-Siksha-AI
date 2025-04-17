import { View, Text, Platform, FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Home/Header";
import Colors from "../../constant/Colors";
import NoCourse from "../../components/Home/NoCourse";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import CourseList from "../../components/Home/CourseList";
import PracticeSection from "../../components/Home/PracticeSection";
import CourseProgress from "../../components/Home/CourseProgress";
import { useRouter } from "expo-router";

export default function Home() {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(collection(db, 'courses'), where("createdBy", '==', userDetail?.email));
      const querySnapshot = await getDocs(q);
      let courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({...doc.data(), id: doc.id});
      });
      setCourseList(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={[]}
      onRefresh={() => GetCourseList()}
      refreshing={loading}
      ListHeaderComponent={
        <View style={{
          padding: 25,
          paddingTop: Platform.OS == 'ios' ? 45 : 25,
          flex: 1,
          backgroundColor: Colors.BLACK
        }}>
          <Header />
          
          {courseList?.length == 0 ? (
            <View>
              <NoCourse />
            </View>
          ) : (
            <View>
              <View style={{
                marginTop: 10
              }}>
                
                <CourseProgress courseList={courseList} />
              </View>
              
              <View>
                <Text style={styles.sectionTitle}>Practice</Text>
                <PracticeSection onPracticePress={(item) => {
                  console.log("Practice item pressed:", item?.name);
                }} />
              </View>
              
              <View>
                <Text style={styles.sectionTitle}>My Courses</Text>
                <CourseList 
                  courseList={courseList} 
                  onCoursePress={(course) => {
                    console.log("Course pressed:", course?.courseTitle);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
    marginTop: 20,
    marginBottom: 10
  }
});