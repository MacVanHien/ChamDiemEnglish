import React, {useState} from 'react';
import { View, Image, Alert, TouchableOpacity, TextInput, Text, Dimensions } from 'react-native';
import { firebase } from '@react-native-firebase/auth';

const W = Dimensions.get("window").width
const H = Dimensions.get("window").height




export default function LogIn({ route, navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dangNhap = () => {
        !!email == false ? Alert.alert('Lỗi: Thông tin tên nhập trống') : null //nhập tên rồi hệ thống tự động thêm @gmail.com vào đuôi
        !!password == false ? Alert.alert('Lỗi: Thông tin mật khẩu nhập trống')  : null

        !!email != false && !!password != false &&
            firebase.auth().signInWithEmailAndPassword(`${email.trim()}@gmail.com`, password)
                .then(() => { navigation.navigate('Home') })
                .catch(error => {
                    Alert.alert('Đăng nhập thất bại! '+ error);
                });
    }


    

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{justifyContent: 'center', alignItems: 'center', width: '100%', height: 200 }}>
                <Image source={require('./imges/ic_launcher_round.png')} style={{ margin: 5, width: W*0.4, height: W*0.4}} resizeMode="cover" />
                <Text
                    allowFontScaling={false}
                    style={{ fontStyle: 'italic', fontWeight: 'bold', marginBottom: H * 0.005, marginBottom: H*0.05, color: '#aaa', fontSize: 13 }}
                >
                    Simple, effective, break the language barrier
                </Text>
            </View>
            <View>
                <TextInput allowFontScaling={false} autoCapitalize="none" value={email} onChangeText={setEmail} placeholder=' Nhập tên đã đăng ký'
                    require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.08)', marginBottom: 3, }}
                    placeholderTextColor={'#fff'}
                />
                <TextInput allowFontScaling={false} autoCapitalize="none" value={password} onChangeText={setPassword} placeholder=' Nhập mật khẩu'
                    secureTextEntry={true} require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.08)', }}
                    placeholderTextColor={'#fff'}
                />
                <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 20}}>
                    <TouchableOpacity
                        style={{
                            width: 150, height: 38, borderColor: 'white', borderWidth: 1, backgroundColor: 'blue', borderRadius: 20,
                            justifyContent: 'center', alignItems: 'center', marginTop: 20
                        }}
                        onPress={()=> {
                            dangNhap()
                        }
                        }
                    >
                        <Text allowFontScaling={false} style={{ color: 'white', fontSize: 15, marginHorizontal: '5.5%' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}
                >
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={false} style={{ fontSize: 14, color: '#333' }}>   Chưa có tài khoản?</Text>
                        <Text allowFontScaling={false} style={{ fontSize: 14, color: 'blue', fontWeight: 'bold' }}> Đăng ký</Text>
                    </View>
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
                        <Image source={require('./imges/iconGoogle.png')} style={{ margin: 5, width: 20, height: 20 }} resizeMode="cover" />
                        <Text style={{ fontSize: 16, color: 'blue' }}>Đăng nhập với Google</Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}