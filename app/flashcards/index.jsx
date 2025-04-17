import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import FlipCard from "react-native-flip-card";
import * as Progress from "react-native-progress";

export default function Flashcards() {
  const router = useRouter();
  const GetProgress = (currentPage) => {
    const per = currentPage / flashcard?.length;
    return per;
  };
  const { courseParams } = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const flashcard = course?.flashcards;
  const [currentPage, setCurrentPage] = useState(0);
  const width = Dimensions.get("screen").width;
  const onScroll = (event) => {
    const index = Math.round(event?.nativeEvent?.contentOffset.x / width);
    console.log(index);
    setCurrentPage(index);
  };
  return (
    <View style={{
      backgroundColor: Colors.BLACK,
      height: '100%'
    }}>
      <View
        style={{
          position: "absolute",

          padding: 25,
          width: "100%",
          backgroundColor: Colors.BLACK,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10
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
            {currentPage + 1} of {flashcard?.length}
          </Text>
        </View>
        <View>
          <Progress.Bar
            progress={GetProgress(currentPage)}
            width={Dimensions.get("window").width * 0.85}
            height={10}
          />
        </View>
        <FlatList
          data={flashcard}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={{
                marginTop: 60,
                height: 500,
                backgroundColor: Colors.GRAY,
                borderRadius: 10
              }}
            >
              <FlipCard style={styles.flipCard}>
                <View style={styles.frontCard}>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: 28,
                    }}
                  >
                    {item?.front}
                  </Text>
                </View>
                <View style={styles.backCard}>
                  <Text
                    style={{
                      width: Dimensions.get("screen").width * 0.78,
                      padding: 15,
                      fontFamily: "outfit",
                      fontSize: 28,
                      textAlign: "center",
                      color: Colors.BLACK,
                    }}
                  >
                    {item?.back}
                  </Text>
                </View>
              </FlipCard>
            </View>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  flipCard: {
    width: Dimensions.get("screen").width * 0.78,
    height: 400,
    backgroundColor: Colors.BG_GRAY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: Dimensions.get("screen").width * 0.05,
    elevation: 10,
  },
  frontCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 20,
  },
  backCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: 20,
    color: Colors.BLACK
  },
});
