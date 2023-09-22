import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const W = Dimensions.get("window").width
const H = Dimensions.get("window").height







const Home = ({ route, navigation }) => {




  return (
    <SafeAreaView style={[styles.container, {marginVertical: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', }]}>
      <View>
        <View style={{marginVertical: 5, flexDirection: 'row', }}>
          <TouchableOpacity>
            <Text style={{ width: W * 0.5, fontSize: 15, fontWeight: 'bold', color: '#00f', }}> Tổng Quỹ: </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ width: W * 0.5, fontSize: 15, fontWeight: 'bold', color: '#00f', }}>Tổng Thưởng: </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.scrollView, { marginBottom: 5, width: W*0.99, } ]}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', }}>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0f0', width: W * 0.499,  marginLeft: W*0.01, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: H * 0.075, backgroundColor: '#0ff', width: W * 0.45, marginVertical: 5, }}>
              <Text>hello world</Text>
            </TouchableOpacity>
            
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
});

export default Home;