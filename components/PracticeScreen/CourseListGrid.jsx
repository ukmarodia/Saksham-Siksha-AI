import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function CourseListGrid({courseList, option}) {
  const router = useRouter();
  const onPress =(course)=>{
    router.push({
      pathname: option.path,
      params: {
        courseParams: JSON.stringify(course)
      }
    })
  }

  return (
    <View style={{
      backgroundColor: Colors.BLACK,
      height: '100%'
    }}>
      <FlatList
      data = {courseList}
      numColumns={2}
      style={{
        padding: 20
      }}
      renderItem={({item,index})=>(
        <TouchableOpacity onPress={()=>onPress(item)} key={index}
        style={{
          flex: 1,
          display:'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
          backgroundColor: Colors.BG_GRAY,
          margin: 7, 
          borderRadius: 15,
          elevation: 1
        }}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN}
          style={{
            position: 'absolute',
            top: 10, left: 20
          }}/>
          <Image source={option?.icon} style={{
            width: "100%",
            height:70 ,
            objectFit: 'contain'
          }}/>
          <Text style={{
            fontFamily: 'outfit',
            textAlign: 'center',
            marginTop: 7
          }}>
            {item.courseTitle}
          </Text>

        </TouchableOpacity>
      )}
      
      />
    </View>
  )
}