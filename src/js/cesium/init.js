Cesium.Ion.defaultAccessToken = CESIUM_TOKEN

let indices_list = [
  {
    name: 'Fleurier',
    longitude: 6.58132,
    latitude: 46.90467,
    altitude: 742.4
  },
  {
    name: 'Yverdon',
    longitude: 6.64098,
    latitude: 46.77856,
    altitude: 435
  }
]

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
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 6378

displayBuildings(viewer)
lookAtSummit(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')
showPyramid(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')

const longitude = 6.538256684
const latitude = 46.851793418
const altitude = 1662.2

document.getElementById('indice').addEventListener('click', function () {
  console.log(indices_list[0])

  const indice = indices_list[0]
  const indice_point = Cesium.Cartesian3.fromDegrees(
    indice.longitude,
    indice.latitude,
    indice.altitude
  )

  // Add Symbol
  const cone = viewer.entities.add({
    position: indice_point,
    cylinder: {
      length: 500.0,
      topRadius: 500,
      bottomRadius: 1,
      material: Cesium.Color.RED,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  })
  const cylinder = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      indice.longitude,
      indice.latitude,
      indice.altitude + 700
    ),
    cylinder: {
      length: 700.0,
      topRadius: 300,
      bottomRadius: 300,
      material: Cesium.Color.RED
    },
    label: {
      text: `.    ${indice.name}`,
      fillColor: Cesium.Color.WHITE,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT
    }
  })

  // Define the positions of the two points in WGS84 (longitude, latitude, height)
  const point1 = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude)
  const point1_transform = Cesium.Transforms.eastNorthUpToFixedFrame(point1)

  // Calculate the direction vector from point1 to point2
  const direction = Cesium.Cartesian3.subtract(
    point1,
    indice_point,
    new Cesium.Cartesian3()
  )
  Cesium.Cartesian3.normalize(direction, direction)

  // Calculate the yaw (heading), pitch, and roll angles
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(point1)
  const quaternion = Cesium.Quaternion.fromRotationMatrix(
    Cesium.Matrix4.getMatrix3(transform, new Cesium.Matrix3())
  )
  const inverseQuaternion = Cesium.Quaternion.inverse(
    quaternion,
    new Cesium.Quaternion()
  )
  const directionLocal = Cesium.Matrix3.multiplyByVector(
    Cesium.Matrix3.fromQuaternion(inverseQuaternion),
    direction,
    new Cesium.Cartesian3()
  )

  let yaw = Math.atan2(directionLocal.y, directionLocal.x)
  yaw = Cesium.Math.toDegrees(yaw)
  let pitch = Math.asin(directionLocal.z)

  console.log(yaw)
  console.log(Cesium.Math.toRadians(yaw))
  if (yaw < 0) {
    yaw = 2 * Math.PI + yaw
  }

  viewer.scene.camera.lookAtTransform(
    point1_transform,
    new Cesium.HeadingPitchRange(yaw, pitch, 150)
  )

  // Add text
  document.getElementById('indice_text').innerHTML += ` ${indice.name},`

  // Delete indice in list
  indices_list.shift()
  // Disabled button
  if (indices_list.length < 1) {
    const button_indice = document.getElementById('indice')
    button_indice.disabled = true
  }
  console.log(indices_list)
})

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
