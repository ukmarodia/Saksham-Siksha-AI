import { View, StyleSheet, FlatList, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Intro from '../../../components/CourseView/intro'
import Colors from '../../../constant/Colors'
import Chapters from '../../../components/CourseView/Chapters'
import { db } from '../../../config/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

export default function CourseView() {
  const { courseParams, courseId } = useLocalSearchParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!courseParams) {
      getCourseById()
    } else {
      try {
        setCourse(JSON.parse(courseParams))
      } catch (error) {
        console.error("Error parsing course params:", error)
      } finally {
        setLoading(false)
      }
    }
  }, [courseId, courseParams])
  
  const getCourseById = async () => {
    try {
      const docRef = await getDoc(doc(db, 'courses', courseId))
      if (docRef.exists()) {
        const courseData = docRef.data()
        setCourse(courseData)
      } else {
        console.log("No course found with ID:", courseId)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        {/* You could add a loading indicator here */}
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={[]} // Empty data array since we're using ListHeaderComponent
        keyExtractor={() => "header"} // Single key since we only have header content
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Intro course={course} />
            <View style={styles.chaptersContainer}>
              <Chapters course={course} />
            </View>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  chaptersContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100, // Add padding at the bottom for better scrolling experience
  }
})