import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import * as Progress from "react-native-progress";
import Button from "./../../components/shared/Button";
import { doc, updateDoc } from "firebase/firestore";

export default function Quiz() {
  const { courseParams } = useLocalSearchParams();
  const router = useRouter();
  const course = JSON.parse(courseParams);
  const [currentPage, setCurrentPage] = useState(0);
  const quiz = course?.quiz;
  const [selectedOption, setSelectedOption] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const GetProgress = (currentPage) => {
    const per = currentPage / quiz?.length;
    return per;
  };
 
  const OnOptionSelect = (selectedChoice) => {
    setResult((prev) => ({
      ...prev,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns,
      },
    }));
  };
  const onQuizFinish = async () => {
    setLoading(true);
    //save the result in datbase for quiz
    try {
      await updateDoc(doc(db, "courses", course?.docId), {
        quizResult: result,
      })
      setLoading(false);
    } catch (e) {
      setLoading(false);
      router.replace({
        pathname: '/quiz/summary',
        params:{
            quizResultParam: JSON.stringify((result))
        }
      })
    }
    // redirect user to quiz summary
  };
  return (
    <View
      style={{
        position: "absolute",
        padding: 25,
        width: "100%",
        backgroundColor: Colors.BLACK,
        height: '100%'
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={()=>router.back()}>
          <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
        </Pressable>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
            color: Colors.WHITE
          }}
        >
          {currentPage + 1} of {quiz?.length}
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Progress.Bar
          progress={GetProgress(currentPage)}
          width={Dimensions.get("window").width * 0.85}
          height={10}
        />
      </View>
      <View
        style={{
          padding: 25,
          backgroundColor: Colors.BG_GRAY,
          marginTop: 30,
          height: Dimensions.get("screen").height * 0.65,
          elevation: 5,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}
        >
          {quiz[currentPage]?.question}
        </Text>
        {quiz[currentPage]?.options.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedOption(index);
              OnOptionSelect(item);
            }}
            key={index}
            style={{
              padding: 20,
              borderWidth: 2,
              borderRadius: 15,
              marginTop: 8,
              backgroundColor:
                selectedOption === index ? Colors.LIGHT_GREEN : null,
              borderColor: selectedOption === index ? Colors.GREEN : null,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 20,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedOption?.toString() && quiz?.length - 1 > currentPage && (
        <Button
          text={"Next"}
          onPress={() => {
            setCurrentPage(currentPage + 1);
            setSelectedOption(null);
          }}
        />
      )}
      {selectedOption?.toString() && quiz?.length - 1 === currentPage && (
        <Button
          text="Finish"
          loading={loading}
          onPress={() => onQuizFinish()}
        />
      )}
    </View>
  );
}