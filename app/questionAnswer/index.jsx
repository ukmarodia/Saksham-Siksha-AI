import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function QuestionAnswer() {
  const { courseParams } = useLocalSearchParams();
  const router = useRouter();
  const course = JSON.parse(courseParams);
  const qaList = course?.qa;
  const [selectedQuestion, setSelectedQuestion] = useState();
  const OnQuestionSelect = (index) => {
    if (selectedQuestion == index) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(index);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BLACK }}>
      <View style={{ padding: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 7,
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color={Colors.WHITE} />
          </Pressable>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 28,
              color: Colors.WHITE,
            }}
          >
            Question & Answers
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "outfit",
            color: Colors.WHITE,
            fontSize: 20,
            padding: 10,
          }}
        >
          {course?.courseTitle}
        </Text>
      </View>

      {/* Scrollable FlatList */}
      <FlatList
        data={qaList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => OnQuestionSelect(index)} style={styles.card}>
            <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
              {item?.question}
            </Text>
            {selectedQuestion == index && (
              <View
                style={{
                  borderTopWidth: 0.4,
                  marginVertical: 10,
                  backgroundColor: Colors.GRAY,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 17,
                    color: Colors.BLACK,
                    padding: 10,
                    textAlign: "center",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  Answer: {item?.answer}
                </Text>
              </View>
            )}
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: Colors.BG_GRAY,
    marginTop: 15,
    borderRadius: 15,
    elevation: 1,
  },
});
