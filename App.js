import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import GetLocation from 'react-native-get-location';

import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let [access, setAccess] = useState(0);
  let [positions, setPositions] = useState([])
  let [text2, setText2] = useState("")
  let [startDisabled, setStartDisabled] = useState(false)
  let [stopDisabled, setStopDisabled] = useState(true)
  let [currentLocation, setCurrentLocation] = useState(null)
  let [markers,setMarkers] = useState(null)
  let [route, setRoute] = useState(null)
  //let [positionsList, setPositionsList] = useState(null)


  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [access]);

  useEffect(() => {
    if (location) {
      positions.push(location)
    }
  }, [location])

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = 'Latitude: ' + location.coords.latitude + ' Longitude: ' + location.coords.longitude
  }

  const accessLocationPeriodically = () => {
    startDisabled = true
    stopDisabled = false
    setStartDisabled(startDisabled)
    setStopDisabled(stopDisabled)
    positions = []
    setPositions(positions)
    markers = null
    setMarkers(markers)
    route = null
    setRoute(route)
  }

  setTimeout(() => {
    if (startDisabled) {
      access = 1 - access
      setAccess(access)
    }
  }, 5000)


  const storeLocations = () => {
    startDisabled = false
    stopDisabled = true
    setStartDisabled(startDisabled)
    setStopDisabled(stopDisabled)
    setPositions(positions)
    currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0004,
      longitudeDelta: 0.0005,
    }
    setCurrentLocation(currentLocation)
    markers = positions.map((position,key)=>{
      if(position && position.coords)
        return <Marker
          key = {key}
          coordinate={{ latitude: position.coords.latitude, longitude: position.coords.longitude }}
          pinColor={"purple"}
          title='Boundary'
          description='Boundary'
        />
    })
    setMarkers(markers)
    route = <Polyline
      coordinates={positions.map((position, key) => {
        if (position && position.coords)
          return { latitude: position.coords.latitude, longitude: position.coords.longitude }
      })}
      strokeColor='#000'
      strokeColors={['#7F0000']}
      strokeWidth={6}
    />
    setRoute(route)
    // positionsList = positions.map((position, key) => {
    //   if(position && position.coords){
    //   // return <Marker
    //   //   key = {key}
    //   //   coordinate={{ latitude: position.coords.latitude, longitude: position.coords.longitude }}
    //   //   pinColor={"purple"}
    //   //   title='Boundary'
    //   //   description='Boundary'
    //   }
    // })
  }

  return (
    <View style={styles.container2}>
      <Text>{text}</Text>
      <Button disabled={startDisabled} title="Start" onPress={accessLocationPeriodically} />
      <Button disabled={stopDisabled} title="Stop" onPress={storeLocations} />
      <MapView
        style={styles.map}
        region={currentLocation}
      >
        {markers}
        {route}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  container2: {
    marginTop: 50,
    marginLeft: 8,
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }

})

// import React from 'react';
// import MapView, { Marker } from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';

// export default function App() {
//   var markers = [
//     {
//       latitude: 45.65,
//       longitude: -78.90,
//       title: 'Foo Place',
//       subtitle: '1234 Foo Drive'
//     }
//   ];
//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map}>
//         <Marker
//           coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
//           pinColor={"purple"} // any color
//           title={"title"}
//           description={"description"}
//         />
//         <Marker
//           coordinate={{ latitude: 37.78826, longitude: -122.4324 }}
//           pinColor={"purple"} // any color
//           title={"title"}
//           description={"description"}
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
// });