Cesium.Ion.defaultAccessToken = CESIUM_TOKEN

const viewer = new Cesium.Viewer('cesiumContainer', {
  // Terrain Swissgeol
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: 'https://download.swissgeol.ch/cli_terrain/ch-2m/',
    availableLevels: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19
    ],
    rectangle: Cesium.Rectangle.fromDegrees(7.13725, 47.8308, 10.4427, 45.88465)
  }),

  // Imagery WMTS geo.admin.ch
  imageryProvider: new Cesium.UrlTemplateImageryProvider({
    url: 'https://wmts{s}.geo.admin.ch/1.0.0/ch.swisstopo.swissimage-product/default/current/4326/{z}/{x}/{y}.jpeg',
    subdomains: '56789',
    availableLevels: [8, 10, 12, 14, 15, 16, 17, 18],
    minimumRetrievingLevel: 8,
    maximumLevel: 17,
    tilingScheme: new Cesium.GeographicTilingScheme({
      numberOfLevelZeroTilesX: 2,
      numberOfLevelZeroTilesY: 1
    })
  }),

  // Suppression des boutons et autres de Cesium
  timeline: false,
  animation: false,
  fullscreenButton: false,
  homeButton: false,
  sceneModePicker: false,
  geocoder: false,
  baseLayerPicker: false,
  navigationHelpButton: false,
  infoBox: false,
  selectionIndicator: false
})

displayBuildings(viewer)
lookAtSummit(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')
showPyramid(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')

const longitude = 6.538256684
const latitude = 46.851793418
const altitude = 1662.2

document
  .getElementById('validateSummit')
  .addEventListener('click', function () {
    // Add Cylinder
    const cylinder = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      cylinder: {
        length: 200.0,
        topRadius: 0.2,
        bottomRadius: 0.2,
        material: Cesium.Color.BLACK,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      label: {
        text: 'Chasseron',
        fillColor: Cesium.Color.WHITE,
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT
      }
    })
  })

document.getElementById('indice').addEventListener('click', function () {
  const yverdon = Cesium.Cartesian3.fromDegrees(6.64098, 46.77856, 435)

  // Add Cone
  const cone = viewer.entities.add({
    position: yverdon,
    cylinder: {
      length: 500.0,
      topRadius: 500,
      bottomRadius: 1,
      material: Cesium.Color.RED,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
  // Add Cylinder
  const cylinder = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(6.64098, 46.77856, 435 + 700),
    cylinder: {
      length: 700.0,
      topRadius: 300,
      bottomRadius: 300,
      material: Cesium.Color.RED
    },
    label: {
      text: '.   Yverdon',
      fillColor: Cesium.Color.WHITE,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT
    }
  })

  //------
  // Define the positions of the two points in WGS84 (longitude, latitude, height)
  const point1 = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude)
  const point1_transform = Cesium.Transforms.eastNorthUpToFixedFrame(point1)
  const point2 = yverdon

  // Calculate the direction vector from point1 to point2
  var direction = Cesium.Cartesian3.subtract(
    point1,
    point2,
    new Cesium.Cartesian3()
  )
  Cesium.Cartesian3.normalize(direction, direction)

  // Calculate the yaw (heading), pitch, and roll angles
  var transform = Cesium.Transforms.eastNorthUpToFixedFrame(point1)
  var quaternion = Cesium.Quaternion.fromRotationMatrix(
    Cesium.Matrix4.getMatrix3(transform, new Cesium.Matrix3())
  )
  var inverseQuaternion = Cesium.Quaternion.inverse(
    quaternion,
    new Cesium.Quaternion()
  )
  var directionLocal = Cesium.Matrix3.multiplyByVector(
    Cesium.Matrix3.fromQuaternion(inverseQuaternion),
    direction,
    new Cesium.Cartesian3()
  )

  var yaw = Math.atan2(directionLocal.y, directionLocal.x)
  var pitch = Math.asin(directionLocal.z)
  var roll = 0.0 // Roll is zero if we assume a flat terrain and no banking.

  // Convert the angles from radians to degrees
  //yaw = Cesium.Math.toDegrees(yaw)
  //pitch = Cesium.Math.toDegrees(pitch)

  viewer.scene.camera.lookAtTransform(
    point1_transform,
    new Cesium.HeadingPitchRange(yaw, pitch, 150)
  )
})
