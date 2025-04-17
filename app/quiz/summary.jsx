import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "./../../constant/Colors";
import Button from "../../components/shared/Button";

export default function QuizSummary() {
  const router = useRouter();
  const { quizResultParam } = useLocalSearchParams();
  const [correctAns, setCorrectAns] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);
  let quizResult = [];
  try {
    quizResult = JSON.parse(quizResultParam);
  } catch (error) {
    console.error("Error parsing quizResultParam:", error.message);
  }

  useEffect(() => {
    quizResult && CalculateResult();
  }, [quizResult]);
  
  const CalculateResult = () => {
    if (quizResult !== undefined) {
      const correctAns_ = Object.entries(quizResult)?.filter(
        ([key, value]) => value?.isCorrect === true
      );
      const totalQues_ = Object.keys(quizResult).length;
      setCorrectAns(correctAns_.length);
      setTotalQuestion(totalQues_);
    }
  };

  const GetPerMark = () => {
    return ((correctAns / totalQuestion) * 100).toFixed(0);
  };

  return (
    <FlatList 
    data={[]}
    ListHeaderComponent={
        <View
          style={{
            position: "relative",
            width: "100%",
            padding: 35,
            backgroundColor: Colors.BLACK
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-bold",
              fontSize: 30,
              color: Colors.WHITE,
            }}
          >
            Quiz Summary
          </Text>
          <View
            style={{
              backgroundColor: Colors.BG_GRAY,
              padding: 20,
              borderRadius: 20,
              marginTop: 60,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              source={require("./../../assets/images/trophy.png")}
              style={{
                width: 100,
                height: 100,
                marginTop: -60,
              }}
            />
            <Text
              style={{
                fontSize: 26,
                fontFamily: "outfit-bold",
              }}
            >
              {" "}
              {GetPerMark() > 60 ? "Congratulations!" : "Try Again"}
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                color: Colors.GRAY,
                fontSize: 17,
              }}
            >
              Your gave {GetPerMark()}% Correct Answer
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>Q {totalQuestion}</Text>
              </View>

              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>✅ {correctAns}</Text>
              </View>

              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>
                  ❌ {totalQuestion - correctAns}
                </Text>
              </View>
            </View>
          </View>
          <Button
            text={"Back To Home"}
            onPress={() => router.replace("/(tabs)/home")}
          />
          <View
            style={{
              marginTop: 25,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 25,
                color: Colors.WHITE
              }}
            >
              Summary:
            </Text>
            <FlatList
              data={Object.entries(quizResult)}
              renderItem={({ item, index }) => {
                const quizItem = item[1];
                return (
                  <View
                    style={{
                      padding: 15,
                      borderWidth: 1,
                      marginTop: 5,
                      borderRadius: 15,
                      backgroundColor:
                        quizItem?.isCorrect === true
                          ? Colors.LIGHT_GREEN
                          : Colors.LIGHT_RED,
                      borderColor:
                        quizItem?.isCorrect === true ? Colors.GREEN : Colors.RED,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit",
                        fontSize: 20,
                      }}
                    >
                      {quizItem.question}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "outfit",
                        fontSize: 15,
                      }}
                    >
                      Ans: {quizItem?.correctAns}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>}/>
  );
}

const styles = StyleSheet.create({
  resultTextContainer: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    elevation: 1,
  },
  resultText: {
    fontFamily: "outfit",
  },
});