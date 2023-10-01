import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Text, Modal, FlatList, View, Image, TouchableOpacity, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/database';
import database from '@react-native-firebase/database';

import moment from 'moment-timezone';


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height







const Home = ({ route, navigation }) => {

  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [email, setEmail] = useState('') //email = nickname: tên để đăng nhập
  // const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [country, setCountry] = useState('');
  //lưu trên firebase là value
  // const [stars, setStars] = useState(null)

  const [contact, setContact] = useState('')
  // const [facebook, setFacebook] = useState('')
  const [game1Record, setgame1Record] = useState('')
  const [game2Record, setgame2Record] = useState('')

  const [star, setStar] = useState('')

  // const [id, setId] = useState(null)
  const [userId, setUserId] = useState('')
  const [data, setData] = useState([])
  const [data1, setData1] = useState([]) //chuyển mảng đảo ngược xuống data1 Để tránh trường hợp bị refresh thì mảng ko đc đảo ngược

  const [isModal1, setIsModal1] = useState(false);

  const [dayTimeIndexForKey, setDayTimeIndexForKey] = useState(1) //để tìm tên khi nhấn nút search

  const [dayTime, setDayTime] = useState('20220222'); //Để mặc định là  1 ngày nào đó trong quá khứ để chạy ok



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


  useEffect(() => {
    if (userId != false) {
      getStars();
      // getDayReviewLsLv1();
      // get_DATA()
    }
  }, [userId]);

  function getStars() {
    firebase.database().ref(`users/${userId}/stars`).once('value', snapshot => {
      snapshot.val() !== null && setStar(snapshot.val());
    });
  }



  useEffect(() => {
    userId != '' && getUserInfor()
    setTimeout(() => {
      userId != '' && get_DATA_Users()
    }, 500);
    userId != '' && firebase.database().ref(`users/${userId}/starUp`).set(false) //cứ có userId là sét false lại khi vào tap personal này
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
      firebase.database().ref(`users/${userId}/game1Record`).on('value', snapshot => {
        snapshot.val() !== null && setgame1Record(snapshot.val());
      });
      firebase.database().ref(`users/${userId}/game2Record`).on('value', snapshot => {
        snapshot.val() !== null && setgame2Record(snapshot.val());
      });
      // firebase.database().ref(`users/${userId}/facebook`).on('value', snapshot => {
      //     snapshot.val() !== null && setFacebook(snapshot.val());
      // });
      firebase.database().ref(`users/${userId}/email`).on('value', snapshot => {
        snapshot.val() !== null && setEmail(snapshot.val());
      });
      // firebase.database().ref(`users/${userId}/stars`).once('value', snapshot => { //để star là once vì mỗi lần vào profile sẽ refresh nên ko sợ ko cập nhật
      //     snapshot.val() !== null && setStars(snapshot.val());
      // });
      firebase.database().ref(`users/${userId}/userName`).on('value', snapshot => {
        snapshot.val() !== null && setUserName(snapshot.val());
      });
    }
  }

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
          game1Record: childData.game1Record,
          game2Record: childData.game2Record,
          stars: childData.stars,
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
          stars: childData.stars,
        });
      });
      // console.log(array)
      setDataFindUser(array)
    });
  }



  //run when start (at page first )  //set dayTimeIndexForKey = 2 (by hand) in firebase and it run !
  useEffect(() => {
    let toDay = moment().format('YYYYMMDD') //Để bỏ bớt hh:mm:ss
    setDayTime(toDay);
    userId != '' && getDayTime();
    //todayDoneHome
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
    firebase.database().ref(`users/dayTimeIndexForKey`).set(2); // update for new day and one divice from user can put another key

    // console.log('########### line 96 updateDataBase "true"')
  }
  //UPDATE key Admind
  useEffect(() => {
    let keyAdmind = Math.floor(Math.random()*1000000)
    // console.log('keyAdmind', keyAdmind)
    if (dayTimeIndexForKey == 2) { //only need this condition!
      firebase.database().ref(`users/keyAdmind`).set(keyAdmind);
      firebase.database().ref(`users/dayTimeIndexForKey`).set(3); // set 3 then another divice from user can't put over another key!
    }
  }, [dayTimeIndexForKey]);








  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center',  }]}>
      <View>
        <View style={{ marginVertical: 5, flexDirection: 'row', backgroundColor: '#fff', height: HEIGHT*0.04, justifyContent: 'center', alignItems: 'center', }}>
          <TouchableOpacity
            onPress={() => {
              // setModalVisible(true)
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
                      // setModalVisible(true)
                      // setLessonInModal(info)
                      navigation.navigate('Personnal');
                    }}
                  >
                    <Text style={{ color: '#00f', fontSize: HEIGHT * 0.019, fontWeight: 'bold', margin: 1, flexWrap: 'wrap', paddingTop: 3, marginHorizontal: 8, textAlign: 'center' }}>
                      {` ${info.userName}`}
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





