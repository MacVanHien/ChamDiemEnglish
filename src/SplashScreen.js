import {firebase} from '@react-native-firebase/auth';
import React, {useEffect} from 'react';
import { View, Image, Text, Dimensions } from 'react-native';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height



export default function SplashScreen({navigation}) {

  useEffect(() => {
    NavigateToAuthAppScreen();
  }, [navigation]);

  function NavigateToAuthAppScreen() {
    setTimeout(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
          navigation.navigate('Home');
        } else {
          //khi nhấn logout bên tap personnal thì bên navigation thay đổi nên lệnh
          //chạy, quay về màn hình login
          navigation.reset({
            index: 0,
            routes: [{name: 'SignUp'}],
          });
        }
      });
    }, 1000);
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('./imges/iconTimeCalculator2.png')}
        style={{ width: '40%', height: WIDTH*0.4}}
        resizeMode= 'contain'
      />
      <Text 
        allowFontScaling={false}
        numberOfLines={1}
        adjustsFontSizeToFit
        style = {{ fontSize: HEIGHT*0.023, fontWeight: 'bold', marginBottom: 10 }}>Time Calculator</Text>
      <Text 
        allowFontScaling={false}
        numberOfLines={1}
        adjustsFontSizeToFit
        style = {{fontSize: HEIGHT*0.021, fontWeight: 'bold', }}>Kết nối cảm xúc</Text>
      <Text 
        allowFontScaling={false}
        numberOfLines={1}
        adjustsFontSizeToFit
        style = {{fontSize: HEIGHT*0.021, fontWeight: 'bold', }}>Kết nối tương lai</Text>
    </View>
  );
}
