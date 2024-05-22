function validateSummit (longitude, latitude, altitude, name) {
  const cylinder = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
    cylinder: {
      length: 200.0,
      topRadius: 0.2,
      bottomRadius: 0.2,
      material: Cesium.Color.BLACK,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
}
