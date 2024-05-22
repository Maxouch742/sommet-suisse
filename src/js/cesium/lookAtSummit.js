function lookAtSummit (viewer, longitude, latitude, altitude, name) {
  // Create point
  const point = Cesium.Cartesian3.fromDegrees(
    longitude,
    latitude,
    altitude - 50
  )
  // 6.538256684, 46.851793418, 1662.2

  // Deplace view
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(point)
  viewer.scene.camera.lookAtTransform(
    transform,
    new Cesium.HeadingPitchRange(0, -Math.PI / 7, 150)
  )
}
