import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../constant/Colors";
import Button from "../../components/shared/Button";
import {
  GenerateCourseAIModel,
  GenerateTopicsAIModel,
} from "../../config/AiModel";
import Prompt from "../../constant/Prompt";
import { db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";

export default function AddCourse() {
  const [placeholderText, setPlaceholderText] = useState(
    "(Ex. Learn Python, Learn 12th Chemistry)"
  );
  const [loading, setLoading] = useState(false);
  const { userDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [topics, setTopics] = useState([]);
  const router = useRouter();
  const [selectedTopic, setSelectedTopics] = useState([]);

  const onGenerateTopic = async () => {
    setLoading(true);
    try {
      const PROMPT = userInput + Prompt.IDEA;
      const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT);
      
      console.log("Raw AI Response:", aiResp);
      
      const responseText = await aiResp.response?.text();
      if (!responseText) throw new Error("AI response is empty or undefined.");
      
      const topicIdea = JSON.parse(responseText);
      console.log("Parsed Topics:", topicIdea);
      
      setTopics(topicIdea?.courseTitles ?? []);
    } catch (error) {
      console.error("Error generating topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const onTopicSelect = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const onGenerateCourse = async () => {
    setLoading(true);
    try {
      const PROMPT = selectedTopic.join(", ") + Prompt.COURSE;
      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
      
      console.log("Raw AI Response:", aiResp);
      
      const responseText = await aiResp.response?.text();
      if (!responseText) throw new Error("AI response is empty or undefined.");
      
      const resp = JSON.parse(responseText);
      const courses = resp.courses;
      console.log("Generated Courses:", courses);
      
      courses?.forEach(async (course) => {
        const docId = Date.now().toString();
        await setDoc(doc(db, "courses", docId), {
          ...course,
          createdOn: new Date(),
          createdBy: userDetail?.email ?? "",
          docId: docId,
        });
      });
      router.push("./(tabs)/home");
    } catch (error) {
      console.error("Error generating courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create New Course</Text>
      <Text style={styles.subHeading}>What you want to learn today?</Text>
      <Text style={styles.description}>
        What course you want to create (ex. Learn Python, Digital Marketing, 10th
        Science Chapters, etc...)
      </Text>

      <TextInput
        placeholder={placeholderText}
        placeholderTextColor={Colors.WHITE}
        style={styles.TextInput}
        numberOfLines={3}
        multiline={true}
        onChangeText={(value) => setUserInput(value)}
        onFocus={() => setPlaceholderText("")} 
        onBlur={() => setPlaceholderText("(Ex. Learn Python, Learn 12th Chemistry)")}
      />
      <Button text="Generate Topic" type="outline" onPress={onGenerateTopic} loading={loading} />

      <View style={styles.topicContainer}>
        <Text style={styles.topicTitle}>Select all topics which you want to add in course.</Text>
        <View style={styles.topicList}>
          {topics.map((item, index) => (
            <Pressable key={index} onPress={() => onTopicSelect(item)}>
              <Text style={[styles.topicItem, selectedTopic.includes(item) && styles.selectedTopic]}> {item} </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {selectedTopic.length > 0 && (
        <Button text="Generate Course" onPress={onGenerateCourse} loading={loading} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: Colors.BLACK, flex: 1 },
  heading: { fontFamily: "outfit-bold", fontSize: 25, color: Colors.WHITE },
  subHeading: { fontFamily: "outfit", fontSize: 25, color: Colors.WHITE, marginTop: 10, padding: 5 },
  description: { fontFamily: "outfit", fontSize: 20, marginTop: 8, color: Colors.BG_GRAY, padding: 5 },
  TextInput: { padding: 15, borderWidth: 1, borderRadius: 15, height: 100, marginTop: 10, fontSize: 18, backgroundColor: Colors.GRAY, color: Colors.WHITE },
  topicContainer: { marginTop: 15, marginBottom: 10 },
  topicTitle: { fontFamily: "outfit", fontSize: 20, color: Colors.WHITE },
  topicList: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 6 },
  topicItem: { padding: 7, borderWidth: 0.4, borderRadius: 99, paddingHorizontal: 16, fontSize: 14, backgroundColor: Colors.GRAY, color: Colors.BLACK },
  selectedTopic: { backgroundColor: Colors.BG_GRAY, color: Colors.BLACK }
});
