import React, { useState } from 'react';
import { StyleSheet, Dimensions ,View, Text, Button} from 'react-native';

import MapView, {Marker, Callout, CalloutSubview, Polyline } from 'react-native-maps';

export type newCoordinates = {
  latitude: number; 
  longitude: number
};


export interface Props  {
    latitude: number,    // initial location latitude
    longitude: number,  // initial location longitude
    latitudeDelta: number,
    longitudeDelta: number,
    accuracy: number,
    myTrack: Array<newCoordinates>,
    showStart: boolean,
    region: {latitude: number,
      longitude: number,
      latitudeDelta: number,
      longitudeDelta: number,
      myTrack: Array<newCoordinates>
    },
    onGetLocation: () => void,
    startMyLocationLoop:() => void,
    endMyLocationLoop:() => void,
    printTrack:() => void,
};



export const myMap: React.FC<Props> = (props) =>{

  const region = {
    latitude: props.region.latitude,
    longitude: props.region.longitude,
    latitudeDelta: props.region.latitudeDelta,
    longitudeDelta: props.region.longitudeDelta,
  };
  return (
    <View style={styles.container}>
      <MapView
        //provider={provider}
        style={styles.map}
        initialRegion={region}
        zoomTapEnabled={false}
        region={region}
        mapType={'standard'}
        showsCompass={true}
        showsMyLocationButton={true}
        showsUserLocation={true}
        followsUserLocation={true}
        loadingEnabled={true}
        
      >
        <Marker coordinate={region} > 
          <Callout >
            <View>
              <Text>Current Location</Text>
            </View>
          </Callout>
        </Marker>
        <Polyline 
          coordinates={props.myTrack}
          strokeColor="#03BD4D" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={6}
        >

        </Polyline>
      </MapView>

      {props.showStart ? (<Button title="Start Location" onPress={()=>{props.startMyLocationLoop()}}/>) : null }
      {!props.showStart ? (<Button title="Stop Location" onPress={()=>{props.endMyLocationLoop()}}/>) : null}
      <Text>Latitude : {props.latitude}</Text>
      <Text>Longitude: {props.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFillObject,
  }
});

export default myMap;