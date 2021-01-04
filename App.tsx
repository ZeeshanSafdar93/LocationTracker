import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React , {useEffect, useState} from 'react';
import { StyleSheet, Dimensions, Text, View, Button } from 'react-native';
import MyMaps, {newCoordinates} from './components/src/map';
import './components/config';
import {addTrack} from './components/config';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE = 37.8025259;
var LONGITUDE = -122.4351431;
var LATITUDE_DELTA = 0.0922;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var watchID = 0;
var firstRun = 0;

const Stack = createStackNavigator();


export default function App() {
 
  const [lat, setLat] = useState(29.9990674);
  const [lon, setLon] = useState(-90.0852767);
  const [acc, setAcc] = useState(13);
  const [loopCheck, setLoopCheck] = useState(false);
  const [showStart, setShowStart] = useState(true);

  const [myTrack, setTrack] = useState([
    { latitude: 37.8025259, longitude: -122.4351431 }]);
    /*{ latitude: 37.7896386, longitude: -122.421646 },
    { latitude: 37.7665248, longitude: -122.4161628 },
    { latitude: 37.7734153, longitude: -122.4577787 },
    { latitude: 37.7948605, longitude: -122.4596065 },
    { latitude: 37.8025259, longitude: -122.4351431 }]);*/


  const getMyLocation1 = () => {
    var crd;
    navigator.geolocation.getCurrentPosition(pos => {
      crd = pos.coords;
      setLat(crd.latitude);
      setLon(crd.longitude);
      setAcc(crd.accuracy);
  
      //console.log('Your current position is:');
      //console.log(`Latitude : ${crd.latitude}`);
      //console.log(`Longitude: ${crd.longitude}`);
      //console.log(`More or less ${crd.accuracy} meters.`);
    });
    return crd;
  };
//maps

const printTrack = () => {
  if(myTrack.length > 0)
  {
    myTrack.forEach(element => {
      console.log("\nlatitude: "+ element.latitude+"\nlongitude: "+ element.longitude);
    });
  }
  else
    console.log("No Element in Array\n");
};
const emptyTrack = () => {
  setTrack([]);
  console.log("\nTrack Cleared:");
};

const error = () => {
  alert('Sorry, no position available.');
}

const options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0,
  distanceFilter: 1
};

var [region, setRegion] = useState({
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
  myTrack: myTrack,
});

//get location every 2 seconds
useEffect(() => {
  if(loopCheck == true){
    wait(2000).then(getMyLocation);
  }
}, [region]);

const endMyLocationLoop = () => {
  //navigator.geolocation.clearWatch(watchID);
  console.log("\nDeactive Watch ID: "+ watchID);
  myTrack.forEach(element => {
    console.log("\nlatitude: "+ element.latitude+"\nlongitude: "+ element.longitude);
  });
  setShowStart(true);
  setLoopCheck(false);
  addTrack(myTrack);
  console.log("Track saved\n");
};

const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const startMyLocationLoop = () => {
  setLoopCheck(true);
  setShowStart(false);
  getMyLocation();
};


const getMyLocation = () => {

  if(firstRun == 0){
    emptyTrack();
    firstRun = 1;
    console.log("\nFirst Run: " +firstRun );
  }

  var crd;
    navigator.geolocation.getCurrentPosition((pos) => {

      crd = pos.coords;
      const distance = crd.accuracy/2;
      const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
      const circumference = 40075;
      const angularDistance = distance/circumference;


      LATITUDE = crd.latitude;
      LONGITUDE = crd.longitude;
      LATITUDE_DELTA = distance / oneDegreeOfLongitudeInMeters;
      LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
      const newCoord = myTrack.concat([{latitude: LATITUDE, longitude: LONGITUDE}]);
      setTrack(newCoord);

      if(newCoord.length > 0)
      {
        newCoord.forEach(element => {
          console.log("\nlatitude: "+ element.latitude+"\nlongitude: "+ element.longitude);
        });
      }
      else
        console.log("No Element in Array\n");
    
      console.log("Loop running\n");

      setRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        myTrack: newCoord,
      });

    },
    error,
    options);

    console.log("\nActive Watch ID: "+ watchID);
  
};

const MyMap = () => {
 return (
  <View style={styles.container}>
    <MyMaps region={region} latitude={LATITUDE} longitude={LONGITUDE} latitudeDelta={LATITUDE_DELTA} longitudeDelta={LONGITUDE_DELTA} accuracy={acc} showStart={showStart} myTrack={myTrack}
      onGetLocation={getMyLocation} startMyLocationLoop={startMyLocationLoop} endMyLocationLoop={endMyLocationLoop} printTrack={printTrack}/>
    <Button title="Empty track" onPress={emptyTrack}></Button>
    <StatusBar style="auto" />
  </View>
  );
};

  return (
    
   
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Map"
          component={MyMap}
          options={{ title: 'Location Tracker' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
});
