import React, { useState } from 'react';
import { View, Image, Alert, TouchableOpacity, TextInput, Text, Dimensions } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import InternetConnectionAlert from "react-native-internet-connection-alert";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height






export default function LogIn({ route, navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dangNhap = () => {
        !!email == false ? Alert.alert('Lỗi: Thông tin tên nhập trống') : null
        !!password == false ? Alert.alert('Lỗi: Thông tin mật khẩu nhập trống') : null

        !!email != false && !!password != false &&
            firebase.auth().signInWithEmailAndPassword(`${email.trim()}@gmail.com`, password)
                .then(() => { navigation.navigate('Home') })
                .catch(error => {
                    Alert.alert('Có lỗi xảy ra! Đăng nhập thất bại! ');
                    console.log("🚀 ~ file: LogIn.js ~ line 23 ~ dangNhap ~ error", error)
                });
    }





    return (
        <InternetConnectionAlert
            onChange={(connectionState) => {
                console.log("Connection State: ", connectionState);
            }}
        >
            {/* {... Your whole application should be here ... } */}
            <View style={{ height: '100%', width: '100%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <Image source={require('./imges/iconTimeCalculator2.png')} style={{ margin: 0, width: '30%', height: WIDTH * 0.3, }} resizeMode="contain" />
                    <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{ fontSize: HEIGHT*0.021, fontWeight: 'bold', marginBottom: 10 }}>Time Calculator</Text>
                </View>
                <View style={{}}>
                    <TextInput allowFontScaling={false} autoCapitalize="none" value={email} onChangeText={setEmail} placeholder=' Nhập tên đã đăng ký'
                        require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.03)', marginBottom: 3, }} />
                    <TextInput allowFontScaling={false} autoCapitalize="none" value={password} onChangeText={setPassword} placeholder=' Nhập mật khẩu'
                        secureTextEntry={true} require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.03)', }} />

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <TouchableOpacity
                            style={{
                                height: HEIGHT*0.05, borderColor: 'white', borderWidth: 1, backgroundColor: 'blue', borderRadius: 20, justifyContent: 'center',
                                alignItems: 'center', marginTop: HEIGHT*0.02
                            }}
                            onPress={() => {
                                dangNhap()
                            }
                            }
                        >
                            <Text
                                allowFontScaling={false}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{ color: 'white', fontSize: HEIGHT*0.02, paddingHorizontal: WIDTH*0.055, fontWeight: 'bold' }}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('SignUp');
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                allowFontScaling={false}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{ fontSize: HEIGHT*0.018, color: '#333' }}>   Chưa có tài khoản?</Text>
                            <Text
                                allowFontScaling={false}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{ fontSize: HEIGHT*0.018, color: 'blue', fontWeight: 'bold' }}> Đăng ký.</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
                        <Image source={require('../img/iconGoogle.png')} style={{ margin: 5, width: 20, height: 20 }} resizeMode="cover" />
                        <Text style={{ fontSize: 16, color: 'blue' }}>Đăng nhập với Google</Text>
                    </View>
                </TouchableOpacity> */}
                </View>
            </View>
        </InternetConnectionAlert>

    )
}