import { View, Text, Image, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PraticeOption } from "../../../constant/Option";
import Colors from "../../../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { db } from "./../../../config/firebaseConfig";
import { collection, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { UserDetailContext } from "./../../../context/UserDetailContext";
import { ActivityIndicator } from "react-native";
import CourseListGrid from "../../../components/PracticeScreen/CourseListGrid";

export default function PracticeTypeHomeScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const option = PraticeOption.find((item) => item.name == type);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    userDetail && GetCourseList();
  }, [userDetail]);

  const GetCourseList = async () => {
    setLoading(true);
    setCourseList([]);
    try {
      const q = query(
        collection(db, "courses"),
        where("createdBy", "==", userDetail?.email),orderBy('createdOn', 'desc')
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setCourseList((prev) => [...prev, doc.data()]);
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <View>
      <Image
        source={option.image}
        style={{
          height: 200,
          width: "100%",
        }}
      />
      <View
        style={{
          position: "absolute",
          padding: 10,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.BLACK}
            style={{
              backgroundColor: Colors.WHITE,
              padding: 8,
              borderRadius: 10,
            }}
          />
        </Pressable>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 35,
            color: Colors.WHITE,
          }}
        >
          {type}
        </Text>
      </View>
      {loading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.PRIMARY}
          style={{
            marginTop: 150,
          }}
        />
      )}
      <CourseListGrid  courseList={courseList} 
      option = {option}/>
    </View>
  );
}
