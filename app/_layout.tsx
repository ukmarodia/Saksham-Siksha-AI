import { Stack } from "expo-router";
import {useFonts} from "expo-font";
import {UserDetailContext} from './../context/UserDetailContext'
import {useState} from 'react';
export default function RootLayout() {

  useFonts({
    'outfit': require('./../assets/fonts/Lexend-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Lexend-Bold.ttf')
  })
  const [userDetail, setUserDetail] = useState();
  return (
    <UserDetailContext.Provider value ={{userDetail, setUserDetail}}>

    
    <Stack screenOptions={{headerShown:false}} >
    </Stack>
    </UserDetailContext.Provider>
  )
}
