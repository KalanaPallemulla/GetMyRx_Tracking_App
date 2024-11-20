import React from 'react';
import {View, StyleSheet} from 'react-native';
import LoadingDots from 'react-native-loading-dots';

function Loading() {
  return (
    <View style={styles.loadingScreen}>
      <View style={styles.dotsWrapper}>
        <LoadingDots />
      </View>
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  loadingScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Ensure the loading screen is on top
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsWrapper: {
    width: 100,
  },
});
