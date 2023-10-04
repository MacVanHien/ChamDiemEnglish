import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Text, Modal, FlatList, View, Image, TouchableOpacity, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';
import database from '@react-native-firebase/database';

import moment from 'moment-timezone';


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height







const Home = ({ route, navigation }) => {

  const [userId, setUserId] = useState('')
  const [data, setData] = useState([])
  const [data1, setData1] = useState([]) //chuyển mảng đảo ngược xuống data1 Để tránh trường hợp bị refresh thì mảng ko đc đảo ngược


  const [dayTimeIndexForKey, setDayTimeIndexForKey] = useState(1) //để tìm tên khi nhấn nút search

  const [dayTime, setDayTime] = useState('20220222'); //Để mặc định là  1 ngày nào đó trong quá khứ để chạy ok

  const [keyAdmindTrueFirebase, setKeyAdmindTrueFirebase] = useState(false)
  const [modalGivePoints, setModalGivePoints] = useState(false)
  const [modalGivePointsId, setModalGivePointsId] = useState(false)

  const [userIdToGivePoints, setUserIdToGivePoints] = useState(false)
  const [userIdToGivePointsName, setUserIdToGivePointsName] = useState(false)
  const [starsOfUserforGive, setStarsOfUserforGive] = useState(null)

  const [countFordetectUserIdForView, setCountFordetectUserIdForView] = useState(2)

  



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


  useEffect(() => {
    if (userId != false) {
      get_DATA_Users()
    }
  }, [userId]);


  //Lấy danh sách người dùng không quá 30 người
  //thu bớt list hiển thị dữ liệu firebase xuống ít hơn 50 bằng set limitToFirst(50)
  const get_DATA_Users = () => {
    let query = firebase.database().ref('users/')
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
    setDayTime(toDay);
    userId != '' && getDayTime();
  }, [userId]);

  function getDayTime() {
    firebase.database().ref(`users/dayTime`).once('value', snapshot => {
      !!snapshot.val() !== false && setDayTime(snapshot.val());
    });
    firebase.database().ref(`users/dayTimeIndexForKey`).on('value', snapshot => { //need "on" so it's can get the update value
      !!snapshot.val() !== false && setDayTimeIndexForKey(snapshot.val());
    });
  }

  // Logic nếu không cùng ngày set lại dữ liệu ngày là Today và các giá trị false hết
  useEffect(() => {
    let toDay = moment().format('YYYYMMDD') //Để bỏ bớt hh:mm:ss
    // console.log('daytime', dayTime)
    if (`${dayTime}` != '20220222' && `${dayTime}` != `${toDay}` && !!userId != false) { // Nếu ngày lưu trên firebase tại khác ngày hiện (Không cùng ngày)
      updateDayTime();
    }
  }, [dayTime]);

  function updateDayTime() {
    setDayTime(moment().format('YYYYMMDD'))
    firebase.database().ref(`users/dayTime`).set(moment().format('YYYYMMDD'));
    firebase.database().ref(`users/${userId}/keyAdmindTrue`).set(false);
    firebase.database().ref(`users/dayTimeIndexForKey`).set(2); // update for new day and one divice from user can put another key
    // console.log('########### line 96 updateDataBase "true"')
  }

  //UPDATE key Admind
  useEffect(() => {
    let keyAdmind = Math.floor(Math.random() * 1000000)
    // console.log('keyAdmind', keyAdmind)
    if (dayTimeIndexForKey == 2) { //only need this condition!
      firebase.database().ref(`users/keyAdmind`).set(keyAdmind);
      firebase.database().ref(`users/dayTimeIndexForKey`).set(3); // set 3 then another divice from user can't put over another key!
    }
  }, [dayTimeIndexForKey]);


  useEffect(() => {
    if (keyAdmindTrueFirebase) {
      console.log('keyAdmind', keyAdmindTrueFirebase);
    }
  }, [keyAdmindTrueFirebase]);


  //it's important so i leave it alone here
  useEffect(() => {
    firebase.database().ref(`users/${userId}/keyAdmindTrue`).on('value', snapshot => { //need "on" so it's can get the update value
      !!snapshot.val() !== false && setKeyAdmindTrueFirebase(snapshot.val());
    });
    firebase.database().ref(`users/${userId}/userIdToGivePointsForView`).on('value', snapshot => { //need "on" so it's can get the update value
      !!snapshot.val() !== false && setModalGivePointsId(snapshot.val());
    });
  }, [userId, countFordetectUserIdForView]);

  useEffect(() => {
    console.log('modalGivePointsId', modalGivePointsId);
    if (modalGivePointsId != 'none') {
      firebase.database().ref(`users/${modalGivePointsId}/userName`).once('value', snapshot => { 
        !!snapshot.val() !== false && setUserIdToGivePointsName(snapshot.val());
      });
      setModalGivePoints(true)
    }
  }, [modalGivePointsId, countFordetectUserIdForView]);








  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', }]}>
      <View>
        <View style={{ marginVertical: 5, flexDirection: 'row', backgroundColor: '#fff', height: HEIGHT * 0.04, justifyContent: 'center', alignItems: 'center', }}>
          <TouchableOpacity
            onPress={() => {
              // setLessonInModal(info)
              navigation.navigate('Personnal');
            }}
          >
            <Text style={{ width: WIDTH * 0.33, fontSize: 15, fontWeight: 'bold', color: '#00f', }}> You: </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={{ width: WIDTH * 0.33, fontSize: 14, fontWeight: 'bold', color: '#00f', }}>Tổng quỹ: </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ width: WIDTH * 0.33, fontSize: 14, fontWeight: 'bold', color: '#00f', }}>Tổng thưởng: </Text>
          </TouchableOpacity>
        </View>


        <ScrollView style={[styles.scrollView, { marginBottom: 5, width: WIDTH * 0.999, }]}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
            {/* <TouchableOpacity style={{ height: HEIGHT * 0.075, backgroundColor: '#0f0', width: WIDTH * 0.499, marginLeft: WIDTH * 0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: HEIGHT * 0.075, backgroundColor: '#0ff', width: WIDTH * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity> */}

            {
              data1.map((info, indx) => {
                return (
                  <TouchableOpacity
                    key={indx * Math.random()}
                    style={{ height: HEIGHT * 0.07, backgroundColor: '#0f0', width: WIDTH * 0.485, marginLeft: WIDTH * 0.01, marginVertical: 5, }}
                    onPress={() => {
                      console.log('info.useridfirebase', info.userIdFirebase)
                      if (keyAdmindTrueFirebase) {
                        firebase.database().ref(`users/userIdToGivePointsForView`).set(info.userIdFirebase)
                        setStarsOfUserforGive(info.stars)
                      }
                    }}
                  >
                    <Text style={{ color: '#00f', fontSize: HEIGHT * 0.019, fontWeight: 'bold', margin: 1, flexWrap: 'wrap', paddingTop: 3, marginHorizontal: 8, textAlign: 'center' }}>
                      {` ${info.userName}: ${info.stars} điểm`}
                    </Text>
                    <Text style={{ color: '#00f', fontSize: HEIGHT * 0.019, fontWeight: 'bold', margin: 1, flexWrap: 'wrap', paddingTop: 3, marginHorizontal: 8, textAlign: 'center' }}>
                      {` ${info.country}`}
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
            {/* <View style={{ width: '90%', height: HEIGHT * 0.35, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, }}>
            </View> */}
            <View style={{ width: '90%', height: HEIGHT*0.7, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, }}>
              {/* Nút back */}
              <TouchableOpacity
                onPress={() => {
                  firebase.database().ref(`users/userIdToGivePointsForView`).set('none')
                  setModalGivePointsId('none') //để fix hiển thị ở máy admind!!
                  setModalGivePoints(false)
                  setCountFordetectUserIdForView(countFordetectUserIdForView + 1)
                }}
                style={{ height: HEIGHT * 0.1, width: WIDTH * 0.85, justifyContent: 'center', position: 'absolute', top: 0, left: 0, }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    allowFontScaling={false}
                    source={require('./imges/BackButton_rbg1.png')}
                    style={{ width: WIDTH * 0.04, height: WIDTH * 0.05, marginLeft: WIDTH * 0.05, marginTop: HEIGHT*0.01, tintColor: '#000', }}
                    resizeMode='stretch'
                  />
                  <View style= {{justifyContent: 'center', alignItems: 'center', flex: 1,  }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', position: 'relative', top: HEIGHT*0.01, left: -WIDTH*0.01, }}>Bảng chấm điểm - {userIdToGivePointsName}</Text>
                  </View>
                </View>
              </TouchableOpacity>


              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: HEIGHT*0.05,  }}>
                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 1)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 1 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 2)
                    console.log('starsOfUserforGive + 2', starsOfUserforGive + 2)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 2 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>2</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 3)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 3 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>3</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 4)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 4 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>4</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 5)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 5 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 6)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 6 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>6</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 7)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 7 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>7</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 8)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 8 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>8</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    firebase.database().ref(`users/${modalGivePointsId}/stars`).set(starsOfUserforGive + 9)
                    setModalGivePoints(false)
                    Alert.alert(`${userIdToGivePointsName} đã nhận thêm 9 điểm.`)
                  }}
                  style={{ width: WIDTH / 4.5, height: WIDTH / 4.5, margin: 10, backgroundColor: '#ff0', alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}
                >
                  <Text style={{fontSize: 17, fontWeight: 'bold', color: '#000', }}>9</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>

      </View>
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





