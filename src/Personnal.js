import React, { useState, useEffect } from 'react';
import { FlatList, Dimensions, Text, Modal, View, Image, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height




export default function Personnal({ navigation }) {


    const [modalVisible, setModalVisible] = useState(true);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [roomOfUser, setRoomOfUser] = useState('')

    const [email, setEmail] = useState('') //email = nickname: tên để đăng nhập
    // const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [country, setCountry] = useState('');
    //lưu trên firebase là value
    // const [tienThuong, setStars] = useState(null)

    const [contact, setContact] = useState('')

    const [tienThuongUser, setTienThuongUser] = useState('')

    // const [id, setId] = useState(null)
    const [userId, setUserId] = useState('')
    const [data, setData] = useState([])
    const [data1, setData1] = useState([]) //chuyển mảng đảo ngược xuống data1 Để tránh trường hợp bị refresh thì mảng ko đc đảo ngược
    const [dataFindUser, setDataFindUser] = useState([{ userName: 'admin', country: 'Vietname', room: 'none', contact: 'macvanhien10@gmail.com' }])

    const [isModal1, setIsModal1] = useState(false);

    const [usersName, setUsersName] = useState('') //để tìm tên khi nhấn nút search

    const [keyAdmind, setKeyAdmind] = useState(2)
    const [keyAdmindTrue, setKeyAdmindTrue] = useState(false)





    useEffect(() => {
        setTimeout(() => {
            setModalVisible(false)
        }, 500);
    }, [])

    //   useEffect(() => {
    //     console.log("dataFindUser: " ,dataFindUser)
    //   }, [dataFindUser])

    useEffect(() => {
        checkUserEmail()
    }, [])

    function checkUserEmail() {
        auth().onAuthStateChanged((user) => {
            if (user != null) {
                //user trả về là một object có key userid, email đang đăng nhập
                setUserId(user.uid)
            } else {
                // console.log('người dùng đang đăng xuất')
            }
        })
    }

    //check room first to get path
    useEffect(() => {
        userId != '' && firebase.database().ref(`users/${userId}/room`).once('value', snapshot => {
            snapshot.val() !== null && setRoomOfUser(snapshot.val());
        });
        // console.log('userId: ', userId)
    }, [userId])

    //get keyAmdind of the room for sign up Admind of user of the room
    useEffect(() => {
        if (userId != false && roomOfUser) {
            firebase.database().ref(`users/room${roomOfUser}/keyAdmind`).on('value', snapshot => { //need "on" so it's can get the update value
                !!snapshot.val() !== false && setKeyAdmind(snapshot.val());
            });
        }
    }, [userId, roomOfUser]);


    useEffect(() => {
        userId != '' && getUserInfor()
        setTimeout(() => {
            userId != '' && get_DATA_Users()
        }, 500);
        // console.log('keyAdmindzzzzzzzzzzzzzzzzzzzzzzzz: ', keyAdmind)
    }, [userId, roomOfUser, keyAdmind]) //Khi email thay đổi thì render lại thì get_DATA_Users mới hoạt động đúng ý định
    function getUserInfor() {
        if (userId && roomOfUser) {
            firebase.database().ref(`users/room${roomOfUser}/${userId}/contact`).on('value', snapshot => {
                snapshot.val() !== null && setContact(snapshot.val());
            });
            firebase.database().ref(`users/room${roomOfUser}/${userId}/country`).on('value', snapshot => {
                snapshot.val() !== null && setCountry(snapshot.val());
            });
            firebase.database().ref(`users/room${roomOfUser}/${userId}/tienThuong`).on('value', snapshot => {
                snapshot.val() !== null && setTienThuongUser(snapshot.val());
            });
            firebase.database().ref(`users/room${roomOfUser}/${userId}/email`).on('value', snapshot => {
                snapshot.val() !== null && setEmail(snapshot.val());
            });
            // firebase.database().ref(`users/${userId}/tienThuong`).once('value', snapshot => { //để star là once vì mỗi lần vào profile sẽ refresh nên ko sợ ko cập nhật
            //     snapshot.val() !== null && setStars(snapshot.val());
            // });
            firebase.database().ref(`users/room${roomOfUser}/${userId}/userName`).on('value', snapshot => {
                snapshot.val() !== null && setUserName(snapshot.val());
            });
        }
    }
    //Lấy danh sách người dùng không quá 30 người
    //thu bớt list hiển thị dữ liệu firebase xuống ít hơn 50 bằng set limitToFirst(50)
    const get_DATA_Users = () => {
        let query = firebase.database().ref(`users/room${roomOfUser}/`)
            .orderByChild('tienThuong') //child để tìm các giá trị so sánh
            // .startAt(0) // sàng lọc các giá trị lớn hơn theo bảng kí tự mã code nếu là chuỗi, nếu số thì lớn hơn số đã cho. Ở đây "1" là chuỗi
            .limitToLast(30); //Giới hạn kết quả là 50/ limitToLast: lấy các giá trị cuối cùng trở lại ( nếu để giá trị 1 thì là lấy giá trị lớn nhất)

        query.on('value', function (snapshot) {
            let array = [];

            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                array.push({
                    country: childData.country,
                    userName: childData.userName,
                    contact: childData.contact,
                    tienThuong: (childData.tienThuong)/1,
                    // diemSo: (childData.stars)/1,
                    userRoomId: childData.userId,
                });
            });
            // console.log(array)
            setData(array)
        });
    }

    //đảo ngược mảng data để xếp lại người có tienThuong cao nhất đến thấp nhất //mảng từ orderbyChild đã sắp xếp theo star thấp đến cao
    useEffect(() => {
        //Loại bỏ phần tử trùng lặp trong mảng :  phần tử chứa userName == undefined //Để loại bỏ các phần tử ảo tải về trên firebase
        const new_arr = data.filter(item => item.userName !== undefined);
        //[...new Set(arrToGetData)] là mảng mới không có phần tử trùng lặp từ mảng arrToGetData
        setData1([...new Set(new_arr)].reverse());
        // console.log('roomof user userName:', userName)

    }, [data])

    //Search Lấy dữ liệu tên người dùng bằng tên có đc do nhập ở input
    const get_User = (userName) => {
        let query = firebase.database().ref('users/')
            .orderByChild('userName') //child để so sánh dùng với startAt và endAt
            .startAt(`${userName}`)// sàng lọc các giá trị lớn hơn theo bảng kí tự mã code nếu là chuỗi, nếu số thì lớn hơn số đã cho. Ở đây "1" là chuỗi
            .limitToFirst(3); //Giới hạn kết quả là 3

        query.on('value', function (snapshot) {
            let array = [];

            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                array.push({
                    id: childSnapshot.key,
                    country: childData.country,
                    userName: childData.userName,
                    contact: childData.contact,
                    // facebook: childData.facebook,
                    room: childData.room,
                });
            });
            // console.log(array)
            setDataFindUser(array)
        });
    }


    // lấy kí tự đầu tiên của các chữ
    function getFirstLetters(str) {
        const firstLetters = str
            .split(' ') //biến chuỗi chữ thành mảng có key là chữ
            .map(word => word[0]) //lấy ký tự đầu của mỗi key 
            .join(''); //gộp các kí tự trước thành chuỗi sẽ gồm các ký tự đầu
        //myArray[myArray.length - 1] để lấy phần tử cuối //đúng với cả chuỗi - coi chuỗi là mảng thì mỗi kí tự là một phần tử
        return firstLetters[firstLetters.length - 1];
    }

    function updateDataBase() {
        if (!!userName == false ) {
            Alert.alert('Tên trống!')
        } else if (userId && !!userName !== false && roomOfUser) {
            setIsModal1(false)
            firebase.database().ref(`users/room${roomOfUser}/${userId}/userName`).set(userName)
            // firebase.database().ref(`users/${userId}/facebook`).set(facebook)
            firebase.database().ref(`users/room${roomOfUser}/${userId}/contact`).set(contact)
        } else {
            Alert.alert('Có lỗi xảy ra!')
            // console.log('##########', !!userName != false)
        }
    }

    signOutUser = async () => {
        try {
            await auth().signOut()
        } catch (e) {
            console.log(e)
        }
    }

    //Tạo bảng thông báo chắc chắn muốn đăng xuất
    const createTwoButtonAlert = () =>
        Alert.alert(
            "", //Alert Title
            "Bạn chắc chắn muốn đăng xuất ?",
            [
                {
                    text: "Hủy bỏ",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => signOutUser() }
            ]
        );
    // console.log(data[0].country)




    useEffect(() => {
        roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${userId}/keyAdmindTrue`).on('value', snapshot => {
            !!snapshot.val() !== false && setKeyAdmindTrue(snapshot.val());
        });
    }, [userId, roomOfUser]);  //có [userId] thì mới chạy được đường đúng trên firebase!


    // useEffect(() => {
    //     console.log('keyAdmindTrue zzzz', keyAdmindTrue)
    //     console.log('keyAdmind zzzz', keyAdmind)
    // }, [keyAdmindTrue, keyAdmind]);  //có [userId] thì mới chạy được đường đúng trên firebase!







    return (
        <View style={{ height: '100%', flex: 1 }}>
            {/* back button & logOut*/}
            <View style={{ flexDirection: 'row', height: HEIGHT * 0.05, width: WIDTH, justifyContent: 'center',  alignItems: 'center', }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Home');
                    }}
                    style={{ height: HEIGHT * 0.055, width: WIDTH * 0.8, justifyContent: 'center', }}
                >
                    <Image
                        allowFontScaling={false}
                        source={require('./imges/BackButton_rbg1.png')}
                        style={{ width: WIDTH * 0.04, height: HEIGHT * 0.03, marginLeft: WIDTH * 0.02, borderRadius: 50, tintColor: 'blue', }}
                        resizeMode='stretch'
                    />
                    <View style={{ width: WIDTH * 0.8, }}>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={createTwoButtonAlert}
                    style={{ paddingLeft: WIDTH * 0.11, flexDirection: 'row', alignItems: 'center', }}
                >
                    <Image
                        source={require('./imges/LogoSignOut.png')}
                        style={{ marginHorizontal: 8, width: 25, height: 25, }}
                        resizeMode="stretch"
                    />
                </TouchableOpacity>
            </View>

            {/* Hiển thị profile và flatlist với width và height full */}
            <View style={{ height: '100%', flex: 1 }}>
                {/* Hiển thị profile */}
                <View
                    style={{
                        width: '97%', flex: 25, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.3)', marginBottom: 7, marginLeft: 6, paddingVertical: 30,
                        flexDirection: 'row', backgroundColor: '#fff', elevation: 5,
                    }}>
                    <View style={{ width: '40%', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <View
                            style={{
                                height: 80, width: 80, padding: 10, backgroundColor: 'pink', borderWidth: 2, borderColor: '#FFFF00', borderRadius: 50,
                                justifyContent: 'center', alignItems: 'center', elevation: 5,
                            }}>
                            <Text allowFontScaling={false}
                                style={{
                                    color: '#006400', textShadowColor: '#eee', textShadowOffset: { width: 1, height: 3 }, textShadowRadius: 5,
                                    fontSize: styles.textNomalBlue.fontSize + HEIGHT * 0.03, fontWeight: 'bold', textTransform: 'capitalize'
                                }}>
                                {`${getFirstLetters(userName)}`}
                            </Text>
                        </View>
                        <Text allowFontScaling={false}
                            style={{
                                textShadowColor: '#ff0', textShadowOffset: { width: 1, height: 3 }, textShadowRadius: 5, color: '#006400',
                                fontWeight: 'bold', marginVertical: 10, fontSize: styles.textNomalBlue.fontSize + HEIGHT * 0.003,
                            }}>
                            {`${userName}`}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                if (keyAdmind == 'false') {
                                    Alert.alert(
                                        '',
                                        `Bạn muốn đăng ký là Admind? `,
                                        [
                                            {
                                                text: 'Cancel',
                                                // onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Đăng ký',
                                                onPress: () => {
                                                    // console.log('dang ky')
                                                    firebase.database().ref(`users/room${roomOfUser}/${userId}/keyAdmindTrue`).set('true')
                                                    firebase.database().ref(`users/room${roomOfUser}/keyAdmind`).set('true')
                                                },
                                                style: 'success',
                                            },
                                        ],
                                        {
                                            cancelable: true,
                                            onDismiss: () => {
                                                // console.log('This alert was dismissed by tapping outside of the alert dialog.')
                                              }
                                        },
                                    );
                                }
                                // database().ref(`users/${userId}/userName`).set('12345abc')
                            }}
                            style={{ display: keyAdmind == 'false'? 'flex' : 'none',}}
                        >
                            <Text allowFontScaling={false}
                                style={{
                                    color: '#00f',
                                    fontWeight: 'bold', marginVertical: 10, fontSize: styles.textNomalBlue.fontSize + HEIGHT * 0.003,
                                }}>
                                {`Đăng ký là Admind`}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ display: keyAdmindTrue == 'true' ? 'flex' : 'none',}}
                            onPress={() => {
                                if (keyAdmindTrue == 'true' && roomOfUser) {
                                    Alert.alert(
                                        '',
                                        `Bạn muốn đăng xuất nick Admind? `,
                                        [
                                            {
                                                text: 'Cancel',
                                                // onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'Đăng xuất',
                                                onPress: () => {
                                                    // console.log('dang xuat')
                                                    firebase.database().ref(`users/room${roomOfUser}/${userId}/keyAdmindTrue`).set('false')
                                                    firebase.database().ref(`users/room${roomOfUser}/keyAdmind`).set('false')
                                                },
                                                style: 'success',
                                            },
                                        ],
                                        {
                                            cancelable: true,
                                            onDismiss: () => {
                                                // console.log('This alert was dismissed by tapping outside of the alert dialog.')
                                              }
                                        },
                                    );
                                }
                            }}
                        >
                            <Text allowFontScaling={false}
                                style={{
                                    display: keyAdmindTrue == 'true' ? 'flex' : 'none',
                                    textShadowColor: '#ff0', textShadowOffset: { width: 1, height: 3 }, textShadowRadius: 5, color: '#00f',
                                    fontWeight: 'bold', marginVertical: 10, fontSize: styles.textNomalBlue.fontSize + HEIGHT * 0.003,
                                }}>
                                {`Admind`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '60%', justifyContent: 'center', marginTop: 15 }}>
                        <Text allowFontScaling={false} style={{ marginVertical: 2, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Name: ${userName}`}</Text>
                        <Text allowFontScaling={false} style={{ marginVertical: 2, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Nickname: ${email}`}</Text>
                        <Text allowFontScaling={false} style={{ marginVertical: 2, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Your country: ${country}`}</Text>
                        {/* <Text allowFontScaling={false} style={{marginVertical: 2, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, }}> {`Facebook: ${facebook}`}</Text> */}
                        <Text allowFontScaling={false} style={{ marginVertical: 2, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Lời nhắn: ${contact}`}</Text>
                        <View style={{ flexDirection: 'row', marginHorizontal: 20, }}>
                            <Text allowFontScaling={false} style={{ marginVertical: 2, fontSize: styles.textNomalBlue.fontSize, fontWeight: 'bold', color: '#006400', }}>{`Tiền thưởng: ${tienThuongUser}k`}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}
                            onPress={() => {
                                setIsModal1(true)
                                // database().ref(`users/${userId}/userName`).set('12345abc')
                            }}
                        >
                            <Text allowFontScaling={false}
                                style={{
                                    fontSize: styles.textNomalBlue.fontSize - HEIGHT * 0.001, color: '#00FF7F', borderWidth: 1,
                                    borderColor: '#ccc', backgroundColor: '#fff', width: 90, borderRadius: 40, margin: 0, padding: 2, textAlign: 'center', elevation: 5,
                                }}>
                                Update
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hiển thị list Người dùng  Bằng Flatlist*/}
                <View style={{ marginBottom: 0, backgroundColor: '#fff', flexShrink: 1, flex: 65, }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#CDAD00', elevation: 5, }}>
                        <TouchableOpacity
                            onPress={()=> {
                                if (keyAdmindTrue == 'true'){
                                    Alert.alert(
                                      '',
                                      'Hành động này sẽ reset lại toàn bộ điểm số về 5đ!',
                                      [
                                        {
                                          text: 'Cancel',
                                        //   onPress: () => console.log('Cancel Pressed'),
                                          style: 'cancel',
                                        },
                                        {
                                          text: 'Ok',
                                          onPress: () => {
                                            // console.log('map of user:', data)
                                            for (var i=0; i<data.length; i++){
                                                roomOfUser && data.length > 0 &&
                                                    firebase.database().ref(`users/room${roomOfUser}/${data[i].userRoomId}/stars`).set(5)
                                                    // về 5đ vừa tránh lỗi số 0 là false với sét lại giá trị là trung bình ý nghĩa trình độ đang trung bình
                                            }
                                          },
                                          style: 'success',
                                        },
                                      ],
                                      {
                                        cancelable: true,
                                        onDismiss: () => {
                                            // console.log('This alert was dismissed by tapping outside of the alert dialog.')
                                          }
                                      },
                                    );
                                  }
                            }}
                        >
                            <Text allowFontScaling={false}
                                style={{
                                    fontSize: styles.textNomalBlue.fontSize, color: '#000', textShadowColor: '#eee', textShadowOffset: { width: 1, height: 3 },
                                    textShadowRadius: 5, fontWeight: 'bold', marginVertical: 0, paddingVertical: 10, paddingHorizontal: 10
                                }}>
                                Room {roomOfUser}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible2(true)
                            }}
                            style={{flexDirection: 'row', width: WIDTH*0.5, }}
                        >
                            <Text allowFontScaling={false} style={{margin: 5, marginRight: 20, color: '#fff' }}>Tìm người dùng ứng dụng </Text>
                            <View>
                                <Image source={require('./imges/search-icon1.png')} style={{ padding: 12, width: 20, height: 20, right: 20, }} resizeMode='cover' />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={data1}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={5}
                        contentContainerStyle={{ paddingBottom: HEIGHT * 0.3 }}
                        style={{ backgroundColor: '#fff', flexGrow: 0, }}
                        // Thêm flexGrow để tính năng height hoạt động
                        renderItem={({ item, index }) =>
                            <View key={index}
                                style={{
                                    marginVertical: 5, borderWidth: 1, borderColor: '#aaa', marginHorizontal: 10, elevation: 4, backgroundColor: '#fff',
                                    borderRadius: 5, paddingVertical: 5, paddingHorizontal: 8,
                                }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                    <Text allowFontScaling={false} style={{ marginVertical: 2, fontSize: 15, fontWeight: 'bold', color: '#006400', }}>
                                        {`${index + 1}. ${item.userName}:`}
                                    </Text>
                                    <Text allowFontScaling={false} style={{ marginVertical: 2, fontSize: 14, fontWeight: 'bold', color: '#006400', }}>
                                        {`    ${item.tienThuong}k (${item.country})`}
                                    </Text>
                                </View>
                                <Text allowFontScaling={false} style={{ marginRight: 0, fontSize: 14 - HEIGHT * 0.001, color: '#000', }}>
                                    {`    Lời nhắn: ${item.contact}`}
                                </Text>
                            </View>
                        }
                    />
                </View>

                {/* Liên hệ với Admin //hình như bottom tab navigation nó có height = 44 !! */}
                <View
                    style={{
                        height: 44, flex: 1, paddingHorizontal: WIDTH * 0.01, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.3)',
                        backgroundColor: '#F5F5F5', flexDirection: 'row', position: 'absolute', bottom: 0, width: WIDTH, elevation: 5,
                    }}>
                    <Text numberOfLines={2}
                        selectable={true}
                        adjustsFontSizeToFit
                        allowFontScaling={false} style={{ color: '#333', fontSize: styles.textSmall.fontSize - HEIGHT * 0.002, position: 'relative', right: 0, textAlign: 'center', }}>
                        Có vấn đề? liên hệ
                        {/* Text trong text */}
                        {<Text
                            allowFontScaling={false}
                            style={{ color: '#333', fontSize: styles.textSmall.fontSize - HEIGHT * 0.003, fontWeight: 'bold', }}
                            selectable={true}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {` macvanhien10@gmail.com `}
                        </Text>
                        }
                    </Text>
                </View>

            </View>




            {/* Giao diện Modal reset infor */}
            <Modal visible={isModal1}>
                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    {/* Nút back */}
                    <TouchableOpacity
                        onPress={() => {
                            setIsModal1(false)
                        }}
                        style={{ height: HEIGHT * 0.055, width: WIDTH * 0.75, justifyContent: 'center', position: 'absolute', top: 0, left: 0, }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                allowFontScaling={false}
                                source={require('./imges/BackButton_rbg1.png')}
                                style={{ width: WIDTH * 0.04, height: WIDTH * 0.05, marginLeft: WIDTH * 0.02, tintColor: 'blue', }}
                                resizeMode='stretch'
                            />
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginVertical: 5, paddingVertical: 30, flexDirection: 'row' }}>
                        <View style={{ width: '40%', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <View
                                style={{
                                    height: 80, width: 80, padding: 10, backgroundColor: 'pink', borderWidth: 2, borderColor: '#FFFF00', borderRadius: 50,
                                    justifyContent: 'center', alignItems: 'center',
                                }}
                            >
                                <Text allowFontScaling={false} style={{
                                    color: '#000', textShadowColor: '#ff0', textShadowOffset: { width: 1, height: 3 }, textShadowRadius: 5,
                                    fontSize: styles.textNomalBlue.fontSize + HEIGHT * 0.03, fontWeight: 'bold', textTransform: 'capitalize', elevation: 5,
                                }}>
                                    {`${getFirstLetters(userName)}`}
                                </Text>
                            </View>
                            <Text allowFontScaling={false}
                                style={{
                                    color: '#006400', textShadowColor: '#ff0', textShadowOffset: { width: 1, height: 3 },
                                    textShadowRadius: 5, fontWeight: 'bold', marginVertical: 10, fontSize: styles.textNomalBlue.fontSize,
                                }}>
                                {`${userName}`}
                            </Text>
                        </View>

                        <View style={{ width: '60%', justifyContent: 'center' }}>
                            <Text allowFontScaling={false} style={{ marginVertical: 3, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Name: ${userName}`}</Text>
                            <Text allowFontScaling={false} style={{ marginVertical: 3, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Nickname: ${email}`}</Text>
                            <Text allowFontScaling={false} style={{ marginVertical: 3, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Your country: ${country}`}</Text>
                            {/* <Text allowFontScaling={false} style={{ marginVertical: 3, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize }}> {`Facebook: ${facebook}`}</Text> */}
                            <Text allowFontScaling={false} style={{ marginVertical: 3, marginHorizontal: 15, fontSize: styles.textNomalBlue.fontSize, color: '#333', }}> {`Lời nhắn: ${contact}`}</Text>
                            <View style={{ flexDirection: 'row', marginHorizontal: 15, }}>
                                <Text allowFontScaling={false} style={{ marginVertical: 2, fontSize: styles.textNomalBlue.fontSize, fontWeight: 'bold', color: '#006400', }}>{`Tiền thưởng: ${tienThuongUser}k`}</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{ height: '40%', width: '90%' }}>
                        <TextInput allowFontScaling={false} value={userName} onChangeText={setUserName} placeholder=' your name ...' placeholderTextColor={'#ccc'}
                            style={{
                                marginVertical: 0, paddingVertical: 5, color: '#006400', paddingLeft: 8,
                                fontSize: styles.textNomalBlue.fontSize, backgroundColor: 'rgba(0, 0, 0, 0.05)', marginBottom: 5,
                            }}
                        />
                        {/* <TextInput allowFontScaling={false} value={facebook} onChangeText={setFacebook} style={{ marginVertical: 0, paddingVertical: 0, color: '#006400', 
                        fontSize: styles.textNomalBlue.fontSize, }} placeholder='your facebook ...' placeholderTextColor={'#ccc'}></TextInput> */}
                        <TextInput allowFontScaling={false} value={contact} onChangeText={setContact}
                            style={{ marginVertical: 0, paddingVertical: 5, color: '#006400', fontSize: styles.textNomalBlue.fontSize, backgroundColor: 'rgba(0, 0, 0, 0.05)', marginBottom: 5, paddingLeft: 8, }}
                            placeholder=' Viết lời nhắn của bạn ...' placeholderTextColor={'#ccc'}
                        />

                        <TouchableOpacity
                            style={{ alignItems: 'center' }}
                            onPress={() => {
                                updateDataBase() //ở updateDataBase có sét tắt modal 
                            }}
                        >
                            <Text allowFontScaling={false}
                                style={{
                                    fontSize: 17, color: '#fff', borderWidth: 1, borderColor: 'blue', backgroundColor: '#00FF7F', width: 90,
                                    borderRadius: 40, margin: 5, padding: 2, textAlign: 'center', elevation: 5, color: '#fff',
                                }}>
                                Ok
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Hiển thị Modal Loading */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('./imges/Loading2.gif')} style={{ marginHorizontal: 8, width: 80, height: 80, zIndex: 1 }} resizeMode='cover' />
                    </View>
                </View>
            </Modal>

            {/* Hiển thị Modal Tìm kiếm User bằng tên */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    setModalVisible(true);
                }}
            >
                <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', }}>
                    <View style={{
                        width: '75%', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,

                    }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginVertical: 8, width: '85%', }}>
                                <TextInput
                                    allowFontScaling={false}
                                    value={usersName}
                                    onChangeText={setUsersName}
                                    placeholder=" Tên người dùng ..."
                                    placeholderTextColor="#bbb"
                                    style={{ fontSize: 17, width: '85%', zIndex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.03)', color: '#000', }}
                                />
                                <TouchableOpacity
                                    style={{ marginBottom: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, }}
                                    onPress={() => get_User(usersName)}
                                >
                                    <Image source={require('./imges/search-icon1.png')} style={{ width: 25, height: 25, top: 5, }} resizeMode='cover' />
                                </TouchableOpacity>
                            </View>
                            {/* Dùng arr.map để hiển thị danh sách đã search được, nếu không có thì Hiển thị là không tìm được */}
                            <View>
                                {
                                    dataFindUser.length == 0 ? <Text style={{ fontSize: 16 }}>Không tìm được kết quả</Text> :
                                        dataFindUser.map((item, index) => {
                                            return (
                                                <View key={index} style={{ marginBottom: 5, marginHorizontal: 12, }}>
                                                    <Text allowFontScaling={false} style={{ fontSize: 15, fontWeight: 'bold', color: '#333', }}> {`${index + 1}. ${item.userName}: Room ${item.room}`} </Text>
                                                    <Text allowFontScaling={false} style={{ fontSize: 15, color: '#333', }}> {`    Country: ${item.country}`}</Text>
                                                </View>
                                            )
                                        })
                                }
                            </View>
                            <Text allowFontScaling={false} style={{ marginTop: 10 }}>{``}</Text>
                            <Text allowFontScaling={false} style={{ marginTop: 10 }}>{``}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginBottom: 12, justifyContent: 'center', alignItems: 'center', }}
                            onPress={() => setModalVisible2(false)}
                        >
                            <Text allowFontScaling={false} style={{ padding: 7, paddingLeft: 20, width: 80, color: '#fff', fontSize: 17, fontWeight: 'bold', backgroundColor: '#250fff', borderRadius: 50, elevation: 5 }}>
                                Hide
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>


        </View>
    )
}






const styles = StyleSheet.create({
    //CSS Chung
    //Text
    textBigShadow: {
        fontSize: HEIGHT * 0.028,
        color: '#333',
        textShadowColor: '#888',
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 5,
        fontWeight: 'bold',
    },
    textNomalBlue: {
        fontSize: HEIGHT * 0.02,
        color: '#006400',
        fontWeight: 'bold',
    },
    textSmall: {
        fontSize: HEIGHT * 0.017,
        color: '#777',
    },
    textTabTopNotActive: {
        color: '#777',
        fontWeight: 'bold',
        fontSize: HEIGHT * 0.022,
        marginHorizontal: '7%'
    },
    textTabTopActive: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: HEIGHT * 0.022,
        marginHorizontal: '7%'
    },

    //modale review lesson user's word && exerciseNow
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        borderWidth: 5,
        borderColor: '#fff',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        marginTop: 5,
        borderRadius: 20,
        padding: 10,
        elevation: 5,
        margin: 0,
    },
    buttonClose: {
        backgroundColor: "blue", //#2196F3 màu mày có vẻ cũng đẹp!
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        width: WIDTH * 0.1,
    },

    //modal in Introduce component
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '8%',
    },
    fadingContainer: {
        marginVertical: '2%',
        paddingVertical: '2%',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 10,
        elevation: 5,
        paddingHorizontal: HEIGHT * 0.02,
        width: WIDTH * 0.85,
    },
    fadingText: {
        fontSize: HEIGHT * 0.02,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: '1%',
    },
    fadingText1: {
        fontSize: HEIGHT * 0.02,
        fontWeight: 'bold',
        color: 'green',
        paddingHorizontal: '7%',
        paddingVertical: '1%',
    },
    buttonRow: {
        flexBasis: 100,
        justifyContent: 'space-evenly',
        marginVertical: 16,
    },

    //TextInput
    viewTextInputQ1: {
        flexDirection: 'row',
        marginHorizontal: '2%',
        marginTop: HEIGHT * 0.03,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    texInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        margin: 0,
        paddingBottom: HEIGHT * 0.005,
        color: '#333',
        backgroundColor: 'pink',
        fontSize: HEIGHT * 0.022,
        fontWeight: 'bold',
        position: 'relative',
        bottom: HEIGHT * 0.005,
    },

    //button
    //3 button in row
    buttonInRow: {
        overflow: 'visible',
        width: WIDTH * 0.28,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, //make shadow
    },
    textButtonInRow: {
        color: '#006400',
        fontSize: HEIGHT * 0.021,
        marginHorizontal: '5%',
        fontWeight: 'bold',
    },

    buttonQ: {
        width: WIDTH * 0.35,
        height: HEIGHT * 0.045,
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: HEIGHT * 0.02,
        elevation: 5
    },
    textButtonQ: {
        color: '#006400',
        fontSize: HEIGHT * 0.021,
        marginHorizontal: '5%',
        fontWeight: 'bold',
    },

    buttonCongratulations: {
        width: '45%',
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        backgroundColor: '#006400',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 38,
        elevation: 5,
    },


    //slider Home and Vocabulary tab
    slideContainer: {
        width: WIDTH,
        height: HEIGHT * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    slideText: {
        paddingTop: HEIGHT * 0.02,
        fontSize: HEIGHT * 0.019,
        fontWeight: 'bold',
        textAlign: 'center',
    },


    //Modal Hint button
    viewModalHint: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        height: '100%',
    },
    //textInModalHintButton
    textModalHintButton: {
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 5,
        color: '#8B658B',
        fontSize: HEIGHT * 0.02,
        fontWeight: 'bold',
        position: 'relative',
        top: -HEIGHT * 0.01,
        marginHorizontal: WIDTH * 0.1,
    },


})