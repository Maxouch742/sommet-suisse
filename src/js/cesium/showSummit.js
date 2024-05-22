function showSummit (viewer, longitude, latitude, altitude, name) {
  // Create point
  const point = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude)
  // 6.538256684, 46.851793418, 1662.2

  // Deplace view
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(point)
  viewer.scene.camera.lookAtTransform(
    transform,
    new Cesium.HeadingPitchRange(0, -Math.PI / 5, 300)
  )

  // show cylinder
  const cylinder = viewer.entities.add({
    name: name,
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude - 20),
    cylinder: {
      length: 50.0,
      topRadius: 10.0,
      bottomRadius: 0.0,
      material: Cesium.Color.RED
    }
  })
}
