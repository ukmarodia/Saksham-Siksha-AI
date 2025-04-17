import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constant/Colors";
import { useRouter } from "expo-router";

export default function Chapters({ course }) {
  const router = useRouter();
  
  const isChapterCompleted = (index) => {
    // Check if course and completedChapter exist before using find
    const isCompleted = course?.completedChapter?.find(item => item == index);
    return isCompleted ? true : false;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chapters</Text>
      <FlatList
        data={course?.chapters}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false} // Disable scrolling in FlatList since parent ScrollView handles scrolling
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/chapterVIew",
                params: {
                  chapterParams: JSON.stringify(item),
                  docId: course?.docId,
                  chapterIndex: index,
                },
              });
            }}
            style={styles.chapterItem}
          >
            <Text style={styles.chapterText}>
              {index + 1}. {item.chapterName}
            </Text>
            {isChapterCompleted(index) ? 
              <Ionicons name="checkmark-circle" size={24} color={Colors.PRIMARY} /> :
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.LIGHT_GRAY} />
            }
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  heading: {
    fontFamily: "outfit-bold",
    fontSize: 22,
    color: Colors.WHITE,
    marginBottom: 15,
  },
  chapterItem: {
    padding: 15,
    borderWidth: 0.5,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.GRAY,
  },
  chapterText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.WHITE,
    flex: 1,
  },
});