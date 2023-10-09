import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Text, Modal, FlatList, View, Image, TouchableOpacity, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';

import moment from 'moment-timezone';


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height







const Home = ({ route, navigation }) => {

  const [userId, setUserId] = useState('')

  const [email, setEmail] = useState('') //email = nickname: tên để đăng nhập
  const [passAdmind, setPassAdmind] = useState('') //email = nickname: tên để đăng nhập
  const [userName, setUserName] = useState('')
  const [country, setCountry] = useState('');
  const [contact, setContact] = useState('')
  const [tienThuongUser, setTienThuongUser] = useState('')

  const [tongQuy, setTongQuy] = useState('')
  const [tongThuong, setTongThuong] = useState('')
  const [tongQuyInput, setTongQuyInput] = useState('')
  const [modalTongQuyTien, setModalTongQuyTien] = useState(false)
  const [soNguoiChamDiem, setSoNguoiChamDiem] = useState(false)

  const [modalCongTienThuong, setModalCongTienThuong] = useState(false)
  const [congTienThuongId, setCongTienThuongId] = useState('')
  const [congTienThuongName, setCongTienThuongName] = useState('')
  const [congTienThuongIdSoTien, setCongTienThuongIdSoTien] = useState('')
  const [congTienThuongInput, setCongTienThuongInput] = useState('')
  
  const [modalChonZoom, setModalChonZoom] = useState(false)
  const [modalReviewZoom, setModalReviewZoom] = useState(false)
  const [roomOfUser, setRoomOfUser] = useState('')
  const [roomIdReview, setRoomIdReview] = useState('none')
  const [mapZone, setMapZone] = useState(["1","2","3","4","5","6","7","8","9","10","11","12"])  //tạo biến ở useState này luôn :)
  const [dataRevew, setDataRevew] = useState([])  //tạo biến ở useState này luôn :)

  const [data, setData] = useState([])
  const [data1, setData1] = useState([]) //chuyển mảng đảo ngược xuống data1 Để tránh trường hợp bị refresh thì mảng ko đc đảo ngược


  const [dayTimeIndexForKey, setDayTimeIndexForKey] = useState(1) //để tìm tên khi nhấn nút search

  const [dayTime, setDayTime] = useState('20220222'); //Để mặc định là  1 ngày nào đó trong quá khứ để chạy ok

  const [keyAdmindTrueFirebase, setKeyAdmindTrueFirebase] = useState(false)
  const [modalGivePoints, setModalGivePoints] = useState(false)
  const [modalGivePointsId, setModalGivePointsId] = useState('none')

  const [userIdToGivePointsName, setUserIdToGivePointsName] = useState(false)
  const [starsOfUserforGive, setStarsOfUserforGive] = useState(null)

  const [countFordetectUserIdForView, setCountFordetectUserIdForView] = useState(2)

  
  //tránh việc để default là false thì nó sẽ luôn hiện lúc mở trong mọi lần vào app
  useEffect(() => {
    setTimeout(() => {
      setModalChonZoom(true)
    }, 500);
  }, [])

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
    userId != '' && firebase.database().ref(`users/${userId}/room`).on('value', snapshot => {
      snapshot.val() !== null && setRoomOfUser(snapshot.val());
    });
  }, [userId])

  //stop modal choose room in first time login
  useEffect(() => {
    roomOfUser && setModalChonZoom(false)
  }, [roomOfUser, modalChonZoom])


  // Lấy lại userInfor để chuyển vào room cho lần chọn room đầu tiên
  useEffect(() => {
    userId != '' && getUserInfor()
    setTimeout(() => {
      userId != '' && get_DATA_Users()
    }, 500);
  }, [userId])
  //Khi email thay đổi thì render lại thì get_DATA_Users mới hoạt động đúng ý định
  function getUserInfor() {
    if (userId) {
      firebase.database().ref(`users/${userId}/contact`).on('value', snapshot => {
        snapshot.val() !== null && setContact(snapshot.val());
      });
      firebase.database().ref(`users/${userId}/country`).on('value', snapshot => {
        snapshot.val() !== null && setCountry(snapshot.val());
      });
      firebase.database().ref(`users/${userId}/tienThuong`).on('value', snapshot => {
        snapshot.val() !== null && setTienThuongUser(snapshot.val());
      });
      firebase.database().ref(`users/${userId}/email`).on('value', snapshot => {
        snapshot.val() !== null && setEmail(snapshot.val());
      });
      // firebase.database().ref(`users/${userId}/keyAdmindTrue`).on('value', snapshot => {
      //   snapshot.val() !== null && setPassAdmind(snapshot.val()); 
      // });
      // firebase.database().ref(`users/${userId}/tienThuong`).once('value', snapshot => { //để star là once vì mỗi lần vào profile sẽ refresh nên ko sợ ko cập nhật
      //     snapshot.val() !== null && setStars(snapshot.val());
      // });
      firebase.database().ref(`users/${userId}/userName`).on('value', snapshot => {
        snapshot.val() !== null && setUserName(snapshot.val());
      });
    }
  }




  useEffect(() => {
    if (userId != false && roomOfUser) {
      setTimeout(() => {
        get_DATA_Users() //setTimeout 500ms thì lại chạy ????!!!!
      }, 500);
      //lấy luôn data tổng thưởng, tổng quỹ
      firebase.database().ref(`users/room${roomOfUser}/tongQuy`).on('value', snapshot => { //need "on" so it's can get the update value
        !!snapshot.val() !== false && setTongQuy(snapshot.val());
      });
      firebase.database().ref(`users/room${roomOfUser}/tongThuong`).on('value', snapshot => { //need "on" so it's can get the update value
        !!snapshot.val() !== false && setTongThuong(snapshot.val());
      });
      // console.log('testaaaa,',roomOfUser, 'id', userId)
    }
    // console.log('test,',roomOfUser, 'id', userId)

  }, [userId, roomOfUser]);
  //Lấy danh sách người dùng không quá 30 người trong room của user 
  //thu bớt list hiển thị dữ liệu firebase xuống ít hơn 50 bằng set limitToFirst(50)
  const get_DATA_Users = () => {
    let query = firebase.database().ref(`users/room${roomOfUser}/`)
      .orderByChild('stars') //child để tìm các giá trị so sánh
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
          // facebook: childData.facebook,
          stars: childData.stars,
          userIdFirebase: childData.userId,
          tienThuong: childData.tienThuong,
        });
      });
      // console.log(array)
      setData(array)
    });
  }


  //đảo ngược mảng data để xếp lại người có stars cao nhất đến thấp nhất
  useEffect(() => {
    //Loại bỏ phần tử trùng lặp trong mảng :  phần tử chứa userName == undefined //Để loại bỏ các phần tử ảo tải về trên firebase
    const new_arr = data.filter(item => item.userName !== undefined);
    //[...new Set(arrToGetData)] là mảng mới không có phần tử trùng lặp từ mảng arrToGetData
    setData1([...new Set(new_arr)].reverse());
  }, [data])


  //run when start (at page first )  //set dayTimeIndexForKey = 2 (by hand) in firebase and it run !
  useEffect(() => {
    let toDay = moment().format('YYYYMMDD') //Để bỏ bớt hh:mm:ss
    if (roomOfUser){
      setDayTime(toDay);
    }
    userId != '' && getDayTime();
  }, [userId]);

  function getDayTime() {
    firebase.database().ref(`users/room${roomOfUser}/${userId}/dayTime`).once('value', snapshot => { //để ở mỗi user để khi user nào đăng nhập ngày mới thì userKeyAdmin về false 
      !!snapshot.val() !== false && setDayTime(snapshot.val());
    });
    firebase.database().ref(`users/room${roomOfUser}/dayTimeIndexForKey`).on('value', snapshot => { //need "on" so it's can get the update value
      !!snapshot.val() !== false && setDayTimeIndexForKey(snapshot.val());
    });
  }

  // Logic nếu không cùng ngày set lại dữ liệu ngày là Today và các giá trị false hết //phải set tất cả các keyAdminduser về false hết!
  useEffect(() => {
    // console.log('daytime', dayTime)
    let toDay = moment().format('YYYYMMDD') //Để bỏ bớt hh:mm:ss
    if (`${dayTime}` != '20220222' && `${dayTime}` != `${toDay}` && !!userId != false && roomOfUser) { //{dayTime}` != '20220222' tức là lấy đc dữ liệu về
      updateDayTime();
      // console.log('daytimezzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', dayTime)
    }
  }, [dayTime, roomOfUser]);

  function updateDayTime() {
    setDayTime(moment().format('YYYYMMDD'))
    firebase.database().ref(`users/room${roomOfUser}/${userId}/dayTime`).set(moment().format('YYYYMMDD'));
    firebase.database().ref(`users/room${roomOfUser}/${userId}/keyAdmindTrue`).set(false);
    firebase.database().ref(`users/room${roomOfUser}/dayTimeIndexForKey`).set(2); // update for new day and one divice from user can put another key
    // console.log('########### line 96 updateDataBase "true"')
  }

  //UPDATE key Admind
  useEffect(() => {
    let keyAdmind = Math.floor(Math.random() * 1000000)
    // console.log('keyAdmind', keyAdmind)
    if (dayTimeIndexForKey == 2 && roomOfUser) { //only need this condition!
      firebase.database().ref(`users/room${roomOfUser}/keyAdmind`).set(keyAdmind);
      firebase.database().ref(`users/room${roomOfUser}/dayTimeIndexForKey`).set(3); // set 3 then another divice from user can't put over another key!
    }
  }, [dayTimeIndexForKey, roomOfUser]);


  useEffect(() => {
    // console.log('data', data[8].tienThuong);
    let tongThuong = 0
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].tienThuong) {
          tongThuong = tongThuong + data[i].tienThuong
        }
      }
    }
    setTongThuong(tongThuong)
    // console.log('tongthuongzzzzaaa', tongThuong)
  }, [data]);


  //it's important so i leave it alone here
  useEffect(() => {
    if (roomOfUser){
      firebase.database().ref(`users/room${roomOfUser}/${userId}/keyAdmindTrue`).on('value', snapshot => { //need "on" so it's can get the update value
        !!snapshot.val() !== false && setKeyAdmindTrueFirebase(snapshot.val());
      });
      firebase.database().ref(`users/room${roomOfUser}/userIdToGivePointsForView`).on('value', snapshot => { //need "on" so it's can get the update value
        !!snapshot.val() !== false && setModalGivePointsId(snapshot.val());
      });
    }
  }, [userId, countFordetectUserIdForView, roomOfUser]);

  useEffect(() => {
    // console.log('modalGivePointsId, modalToGivePoint', modalGivePointsId, modalGivePoints);
    if (modalGivePointsId != 'none' && roomOfUser) {
      firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/userName`).once('value', snapshot => { 
        !!snapshot.val() !== false && setUserIdToGivePointsName(snapshot.val());
      });
      firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).on('value', snapshot => { 
        !!snapshot.val() !== false && setStarsOfUserforGive(snapshot.val());
      });
      setModalGivePoints(true)
    }
  }, [modalGivePointsId, countFordetectUserIdForView, roomOfUser]);

  //cập nhật tổng quỹ tổng thưởng từ firebase
  useEffect(() => {
    if (roomOfUser) {
      firebase.database().ref(`users/room${roomOfUser}/tongQuy`).on('value', snapshot => {
        !!snapshot.val() !== false && setTongQuy(snapshot.val());
      });
      firebase.database().ref(`users/room${roomOfUser}/tongThuong`).on('value', snapshot => {
        !!snapshot.val() !== false && setTongThuong(snapshot.val());
      });
      firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).on('value', snapshot => {
        !!snapshot.val() !== false && setSoNguoiChamDiem(snapshot.val() / 1);
      });
    }
  }, []);


  useEffect(() => {
    if (modalGivePointsId == 'none'){
      setModalGivePoints(false)
    }
  }, [modalGivePointsId])


  //lấy danh sách thành viên trong roomIdReview
  useEffect(() => {
    if (roomIdReview !== 'none'){
      let query = firebase.database().ref(`users/room${roomIdReview}/`)
        .orderByChild('stars') //child để tìm các giá trị so sánh
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
            // facebook: childData.facebook,
            stars: childData.stars,
            userIdFirebase: childData.userId,
            tienThuong: childData.tienThuong,
          });
        });
        // console.log(`setDataRevew`, array);
        setDataRevew(array)
      });
    }
  }, [roomIdReview])









  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', }]}>
      <View>
        {/* View top: you, tongQuy, TongThuong */}
        <View style={{
          marginVertical: 5, flexDirection: 'row', backgroundColor: '#006400', height: HEIGHT * 0.04,
          justifyContent: 'center', alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={() => {
              // setLessonInModal(info)
              navigation.navigate('Personnal');
            }}
            style={{backgroundColor: '#006400', borderRightWidth: 2, borderColor: '#ccc', marginLeft: WIDTH*0.02, }}
          >
            <Text allowFontScaling={false} style={{ width: WIDTH * 0.3, fontSize: 15, fontWeight: 'bold', color: '#fff', }}>
              {`You`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=> {
              setModalTongQuyTien(true)
            }} 
            style={{backgroundColor: '#006400', borderRightWidth: 2, borderColor: '#ccc', }}         
          >
            <Text allowFontScaling={false} style={{
              width: WIDTH * 0.33, fontSize: 14, fontWeight: 'bold',
              color: tongQuy / 1 >= tongThuong / 1 ? '#fff' : '#f00',
            }}>
              {` Tổng quỹ: ${tongQuy}k`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            ononPress={()=> {
              setModalTongQuyTien(true)
            }}          
          >
            <Text allowFontScaling={false} style={{ width: WIDTH * 0.33, fontSize: 14, fontWeight: 'bold', color: '#fff', }}>
              {` Tổng thưởng: ${tongThuong}k`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* View Bảng Thành viên trong room */}
        <ScrollView style={{ marginBottom: 5, width: WIDTH * 0.999, backgroundColor: '#fff', }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
            {
              data1.map((info, indx) => {
                return (
                  <TouchableOpacity
                    key={indx * Math.random()}
                    style={{
                      height: HEIGHT * 0.07, backgroundColor: (info.tienThuong) / 1 < 50 ? '#fff' : '#ADFF2F', width: WIDTH * 0.485,
                      marginLeft: WIDTH * 0.01, marginVertical: 5, borderRadius: 3, elevation: 5, borderColor: '#333', borderWidth:0.5,
                    }}
                    onPress={() => {
                      if (keyAdmindTrueFirebase) {
                        // firebase.database().ref(`users/userIdToGivePointsForView`).set(info.userIdFirebase)
                        // setStarsOfUserforGive(info.stars)
                        Alert.alert(
                          '',
                          'Chọn chức năng:',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'Cộng tiền thưởng',
                              onPress: () => {
                                setCongTienThuongId(info.userIdFirebase)
                                setCongTienThuongName(info.userName)
                                setModalCongTienThuong(true)
                                setCongTienThuongIdSoTien(info.tienThuong)
                              },
                              style: 'success',
                            },
                            {
                              text: 'Chọn thành viên',
                              onPress: () => {
                                // console.log('info.useridfirebase', info.userIdFirebase)
                                if (keyAdmindTrueFirebase && roomOfUser) {
                                  firebase.database().ref(`users/room${roomOfUser}/userIdToGivePointsForView`).set(info.userIdFirebase)
                                  // setStarsOfUserforGive(info.stars)
                                }
                              },
                              style: 'success',
                            },
                          ],
                          {
                            cancelable: true,
                            onDismiss: () =>
                              console.log(
                                'This alert was dismissed by tapping outside of the alert dialog.',
                              ),
                          },
                        );
                      }
                    }}
                  >
                    <Text allowFontScaling={false} borderColor='#000' style={{
                      color: '#006400', fontSize: HEIGHT * 0.019, fontWeight: 'bold', margin: 1, flexWrap: 'wrap',
                      paddingTop: 3, marginHorizontal: 8, textAlign: 'center', 
                      // textShadowOffset: { width: 0.1, height: 0.1 }, textShadowRadius: 0.5, textShadowColor: '#000',
                    }}>
                      {` ${info.userName}: ${info.stars} điểm.`}
                    </Text>
                    <Text allowFontScaling={false} style={{
                      color: '#006400', fontSize: HEIGHT * 0.019, fontWeight: 'bold',
                      margin: 1, flexWrap: 'wrap', marginHorizontal: 8, textAlign: 'center',
                      // textShadowOffset: { width: 0.1, height: 0.1 }, textShadowRadius: 0.5, textShadowColor: '#000',
                    }}>
                      {`Tiền thưởng: ${(info.tienThuong)/1}k (${info.country})`}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </ScrollView>


        {/* Hiển thị modal chấm điểm */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalGivePoints}
        >
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
            <View 
              style={{
                width: '90%', height: HEIGHT * 0.7, justifyContent: 'center',
                alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10,
              }}
            >
              {/* Nút back */}
              <TouchableOpacity
                onPress={() => {
                  if (keyAdmindTrueFirebase){
                    Alert.alert(
                      '',
                      'Thoát chọn thành viên?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Ok',
                          onPress: () => {
                            roomOfUser && firebase.database().ref(`users/room${roomOfUser}/userIdToGivePointsForView`).set('none')
                            setModalGivePointsId('none') //để fix hiển thị ở máy admind!!
                            setModalGivePoints(false)
                            setCountFordetectUserIdForView(countFordetectUserIdForView + 1)
                          },
                          style: 'success',
                        },
                      ],
                      {
                        cancelable: true,
                        onDismiss: () =>
                          console.log(
                            'This alert was dismissed by tapping outside of the alert dialog.',
                          ),
                      },
                    );
                  }
                }}
                style={{height: HEIGHT * 0.1, width: WIDTH * 0.9, justifyContent: 'center', position: 'absolute', top: 0, left: 0, }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    allowFontScaling={false}
                    source={require('./imges/BackButton_rbg1.png')}
                    style={{ width: WIDTH * 0.04, height: WIDTH * 0.05, marginLeft: WIDTH * 0.05, marginTop: HEIGHT*0.01, tintColor: '#000', display: keyAdmindTrueFirebase? 'flex' : 'none', }}
                    resizeMode='stretch'
                  />
                  <View style= {{justifyContent: 'center', alignItems: 'center', flex: 1,  }}>
                    <Text allowFontScaling={false} style={{
                      fontSize: 18, fontWeight: 'bold', color: '#fff',
                      position: 'relative', top: HEIGHT * 0.01, left: -WIDTH * 0.01,
                    }}>
                      Bảng chấm điểm - {userIdToGivePointsName}
                    </Text>
                    <Text allowFontScaling={false} style={{
                      fontSize: 14, fontWeight: 'bold', color: '#fff',
                      position: 'relative', top: HEIGHT * 0.01, left: -WIDTH * 0.01,
                    }}>
                      Số người đã chấm điểm - {soNguoiChamDiem/1}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>


              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: HEIGHT*0.05,  }}>
                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 1)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 1 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 2)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      // console.log('starsOfUserforGive + 2', starsOfUserforGive + 2)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 2 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 3)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 3 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>3</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 4)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 4 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>4</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 5)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 5 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 6)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 6 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>6</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 7)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 7 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>7</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 8)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 8 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>8</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!keyAdmindTrueFirebase){
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${modalGivePointsId}/stars`).set(starsOfUserforGive + 9)
                      roomOfUser && firebase.database().ref(`users/room${roomOfUser}/soNguoiChamDiem`).set(soNguoiChamDiem/1 + 1)
                      setModalGivePoints(false)
                      Alert.alert(`${userIdToGivePointsName} đã nhận thêm 9 điểm.`)
                    }
                  }}
                  style={{
                    width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 10,
                  }}
                >
                  <Text allowFontScaling={false} style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>9</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>

      </View>

      {/* Hiển thị modal cộng quỹ của Admind */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalTongQuyTien}
        onRequestClose={() => {
          setModalTongQuyTien(!modalTongQuyTien);
        }}
      >
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', }}>
          <View 
            style={{
              width: '90%', height: HEIGHT * 0.35, justifyContent: 'center', alignItems: 'center',
              backgroundColor: '#fff', borderRadius: 5,
            }}
          >
            <TextInput allowFontScaling={false} autoCapitalize="none" value={tongQuyInput} onChangeText={setTongQuyInput} 
            placeholder=' Nhập số tiền thêm vào tổng quỹ...'
              require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.08)', marginBottom: 10, }}
              placeholderTextColor={'#fff'}
            />
            <TouchableOpacity
              style={{
                width: 150, height: 38, borderColor: 'white', borderWidth: 1, backgroundColor: 'blue', borderRadius: 20,
                justifyContent: 'center', alignItems: 'center', marginTop: 20
              }}
              onPress={() => {
                if (!isNaN(tongQuyInput/1)) {
                  setModalTongQuyTien(false)
                  roomOfUser && firebase.database().ref(`users/room${roomOfUser}/tongQuy`).set(tongQuy/1 + tongQuyInput/1)
                  Alert.alert(`Đã cộng ${tongQuyInput/1}k vào tổng quỹ.`);
                } else {
                  Alert.alert(`Hãy nhập một số hoặc bỏ trống(nếu cộng 0k)!`);
                }
              }
              }
            >
              <Text allowFontScaling={false} style={{ color: '#fff', fontSize: 15, marginHorizontal: '5.5%' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hiển thị modal cộng thưởng cho thành viên của Admind */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCongTienThuong}
        onRequestClose={() => {
          setModalTongQuyTien(!modalCongTienThuong);
        }}
      >
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', }}>
          <View style={{ width: '90%', height: HEIGHT * 0.35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, }}>
            <TextInput allowFontScaling={false} autoCapitalize="none" value={congTienThuongInput} onChangeText={setCongTienThuongInput} 
            placeholder=' Nhập số tiền thưởng cho thành viên...'
              require={true} style={{ fontSize: 16, color: '#333', width: 300, backgroundColor: 'rgba(0, 0, 0, 0.08)', marginBottom: 10, }}
              placeholderTextColor={'#fff'}
            />
            <TouchableOpacity
              style={{
                width: 150, height: 38, borderColor: 'white', borderWidth: 1, backgroundColor: 'blue', borderRadius: 20,
                justifyContent: 'center', alignItems: 'center', marginTop: 20
              }}
              onPress={() => {
                if (!isNaN(congTienThuongInput/1) && congTienThuongId) {
                  setModalCongTienThuong(false)
                  roomOfUser && firebase.database().ref(`users/room${roomOfUser}/${congTienThuongId}/tienThuong`).set(congTienThuongIdSoTien/1 + congTienThuongInput/1)
                  Alert.alert(`${congTienThuongName} đã được cộng ${congTienThuongInput/1}k vào tổng tiền thưởng.`);
                } else if (isNaN(congTienThuongInput/1)){
                  Alert.alert(`Hãy nhập một số hoặc bỏ trống(nếu cộng 0k)!`);
                } else {
                  Alert.alert(`Có lỗi xảy ra, vui lòng thử lại sau hoặc báo với Admind!`);
                }
              }
              }
            >
              <Text allowFontScaling={false} style={{ color: '#fff', fontSize: 15, marginHorizontal: '5.5%' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hiển thị modal Chọn zoom khi mới đăng nhập mới chưa có zoom */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalChonZoom}
        onRequestClose={() => {
          setModalTongQuyTien(!modalChonZoom);
        }}
      >
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', }}>
          <ScrollView style={{ marginBottom: 5, width: WIDTH * 0.999, backgroundColor: '#fff', }}>
            <Text allowFontScaling={false} style={{
              color: '#333', fontSize: HEIGHT * 0.022, width: WIDTH, fontWeight: 'bold', flexWrap: 'wrap', textAlign: 'center',
              marginVertical: HEIGHT*0.1,
            }}>
              Chọn room để tham gia team!
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              {
                mapZone.map((info, indx) => {
                  return (
                    <TouchableOpacity
                      key={indx * Math.random()}
                      style={{
                        height: HEIGHT * 0.07, backgroundColor: (info.tienThuong) / 1 < 50 ? '#fff' : '#ADFF2F', width: WIDTH * 0.4,
                        marginLeft: WIDTH * 0.067, marginVertical: 5, borderRadius: 3, elevation: 5, borderColor: '#333', borderWidth: 0.5,
                        justifyContent: 'center', alignItems: 'center',
                      }}
                      onPress={() => {
                        Alert.alert(
                          '',
                          `Chọn chức năng: `,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'Review room',
                              onPress: () => {
                                setRoomIdReview(info)
                                setTimeout(() => {
                                  setModalReviewZoom(true)
                                }, 300);
                              },
                              style: 'success',
                            },
                            {
                              text: 'Chọn room',
                              onPress: () => {
                                Alert.alert(
                                  '',
                                  `Bạn muốn chọn room${info} này?`,
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () => console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'Ok',
                                      onPress: () => {
                                        firebase.database().ref(`users/${userId}/room`).set(info)
                                        firebase.database().ref(`users/room${info}/${userId}`).set({
                                          // firebase.database().ref('users/' + id).set({
                                          email: email.trim(), //NickName đăng nhập
                                          userName: userName.trim(), //Sau này sẽ sét lại được
                                          country: country,
                                          facebook: '',
                                          contact: '',
                                          tienThuong: 0,
                                          stars: 5, //đăng nhập lần đầu là 5 star, thì có thể tránh lỗi !!0 == false  //điểm 5 thể hiện biểu trưng đang level trung bình :)
                                          dayTime: moment().format('YYYYMMDD'),
                                          userId: userId,
                                          room: `${info}`,
                                        })
                                        setModalChonZoom(false)
                                        Alert.alert(`Bạn đã là thành viên của room${info}.`)
                                      },
                                      style: 'success',
                                    },
                                  ],
                                  {
                                    cancelable: true,
                                    onDismiss: () =>
                                      console.log(
                                        'This alert was dismissed by tapping outside of the alert dialog.',
                                      ),
                                  },
                                );
                              },
                              style: 'success',
                            },
                          ],
                          {
                            cancelable: true,
                            onDismiss: () =>
                              console.log(
                                'This alert was dismissed by tapping outside of the alert dialog.',
                              ),
                          },
                        );
                        
                      }}
                    >
                      <Text allowFontScaling={false} borderColor='#000' style={{
                        color: '#006400', fontSize: HEIGHT * 0.019, fontWeight: 'bold', margin: 1, flexWrap: 'wrap',
                        paddingTop: 3, marginHorizontal: 8, textAlign: 'center',
                        // textShadowOffset: { width: 0.1, height: 0.1 }, textShadowRadius: 0.5, textShadowColor: '#000',
                      }}>
                        {`Room ${info}.`}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Hiển thị modal thông tin người dùng trong zoom để review */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalReviewZoom}
        onRequestClose={() => {
          setModalTongQuyTien(!modalReviewZoom);
        }}
      >
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', }}>
          <View style={{width: WIDTH*0.8, height: HEIGHT* 0.9, borderRadius: 5, backgroundColor: '#008000', }}>
            {/* Nút back */}
            <TouchableOpacity
              onPress={() => {
                setModalReviewZoom(false)
              }}
              style={{ height: HEIGHT * 0.07, width: WIDTH * 0.9, justifyContent: 'center', }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  allowFontScaling={false}
                  source={require('./imges/BackButton_rbg1.png')}
                  style={{ width: WIDTH * 0.04, height: WIDTH * 0.05, marginLeft: WIDTH * 0.05, marginTop: HEIGHT * 0.01, tintColor: '#333', }}
                  resizeMode='stretch'
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                  <Text allowFontScaling={false} style={{
                    fontSize: 18, fontWeight: 'bold', color: '#fff',
                    position: 'relative', top: HEIGHT * 0.01, left: -WIDTH * 0.09,
                  }}>
                    Room {roomIdReview}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Hiển thị list Người dùng  Bằng Flatlist*/}
            <View style={{ marginBottom: 0, backgroundColor: '#fff', flexShrink: 1, flex: 1, }}>

              <FlatList
                data={dataRevew}
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
                        {`    ${item.tienThuong}k (${item.country}),`}
                      </Text>
                    </View>
                    <Text allowFontScaling={false} style={{ marginRight: 0, fontSize: 14 - HEIGHT * 0.001, color: '#000', }}>
                      {`    Lời nhắn: ${item.contact}`}
                    </Text>
                  </View>
                }
              />
            </View>
          </View>

        </View>
      </Modal>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 42,
  },



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
    color: '#00f',
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
    color: '#00f',
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
    color: '#00f',
    fontSize: HEIGHT * 0.021,
    marginHorizontal: '5%',
    fontWeight: 'bold',
  },

  buttonCongratulations: {
    width: '45%',
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#00f',
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



});




export default Home;





