let username = 'Anonyme'

const longitude = 6.538256684
const latitude = 46.851793418
const altitude = 1662.2

let indices_list = []

/*let indices_list = [
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
]*/

/***********************************************************************
 *
 * CCCCCCCCC  EEEEEEEEE  SSSSSSSSS  III  UUU    UU  MM     MM
 * CCCCCCCCC  EEEEEEEEE  SSSSSSSSS  III  UUU    UU  MMM   MMM
 * CCC        EE         SS         III  UUU    UU  MM MMM MM
 * CCC        EEEEE      SSSSSSSSS  III  UUU    UU  MM  M  MM
 * CCC        EEEEE      SSSSSSSSS  III  UUU    UU  MM     MM
 * CCC        EE                SS  III  UUU    UU  MM     MM
 * CCCCCCCCC  EEEEEEEEE  SSSSSSSSS  III  UUUUUUUUU  MM     MM
 * CCCCCCCCC  EEEEEEEEE  SSSSSSSSS  III  UUUUUUUUU  MM     MM
 *
 **********************************************************************/

//----------------------- FONCTIONS -----------------------

async function displayBuildings (viewer) {
  const buildings = await Cesium.Cesium3DTileset.fromUrl(
    'https://vectortiles0.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20180716/tileset.json',
    {
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true
    }
  )
  viewer.scene.primitives.add(buildings)
}

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

function showPyramid (viewer, longitude, latitude, altitude, name) {
  // Define the vertices for the pyramid base (a square) and the apex
  var baseHeight = 0.0 // Height of the base of the pyramid
  var apexHeight = 5.0 // Height of the apex of the pyramid

  var baseSize = 3.0 // Half size of the base square
  var baseVertices = [
    new Cesium.Cartesian3(-baseSize, -baseSize, baseHeight),
    new Cesium.Cartesian3(baseSize, -baseSize, baseHeight),
    new Cesium.Cartesian3(baseSize, baseSize, baseHeight),
    new Cesium.Cartesian3(-baseSize, baseSize, baseHeight)
  ]

  var apexVertex = new Cesium.Cartesian3(0.0, 0.0, apexHeight)

  // Create the pyramid geometry
  var pyramidGeometry = new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: [
          baseVertices[0].x,
          baseVertices[0].y,
          baseVertices[0].z,
          baseVertices[1].x,
          baseVertices[1].y,
          baseVertices[1].z,
          baseVertices[2].x,
          baseVertices[2].y,
          baseVertices[2].z,
          baseVertices[3].x,
          baseVertices[3].y,
          baseVertices[3].z,
          apexVertex.x,
          apexVertex.y,
          apexVertex.z
        ]
      })
    },
    indices: new Uint16Array([
      0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4, 0, 1, 2, 2, 3, 0
    ]),
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere: Cesium.BoundingSphere.fromVertices([
      baseVertices[0].x,
      baseVertices[0].y,
      baseVertices[0].z,
      baseVertices[1].x,
      baseVertices[1].y,
      baseVertices[1].z,
      baseVertices[2].x,
      baseVertices[2].y,
      baseVertices[2].z,
      baseVertices[3].x,
      baseVertices[3].y,
      baseVertices[3].z,
      apexVertex.x,
      apexVertex.y,
      apexVertex.z
    ])
  })

  // Create an instance of the geometry and add it to the scene
  var pyramidInstance = new Cesium.GeometryInstance({
    geometry: pyramidGeometry,
    modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude - 55)
      ),
      new Cesium.Cartesian3(0.0, 0.0, 0.0),
      new Cesium.Matrix4()
    ),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
    }
  })

  // Add the pyramid to the scene
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: pyramidInstance,
      appearance: new Cesium.PerInstanceColorAppearance()
    })
  )
}

//----------------------- MAIN PROGRAM -----------------------

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNGY0Mjk4Ny1kYWMxLTQwZjMtOWM5YS0zZDY0Y2UyYTI5MTciLCJpZCI6MTk3MjAyLCJpYXQiOjE3MDg2MDY5MzN9.0zahHvP9QC7E_C0zRuIDDe_QTPEuUafXfgvRREVXAis'

// Define viewer for cesium map
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: 'https://download.swissgeol.ch/cli_terrain/ch-2m/',
    availableLevels: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19
    ],
    rectangle: Cesium.Rectangle.fromDegrees(7.13725, 47.8308, 10.4427, 45.88465)
  }),
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
// Blocage de la distance maximale pour éviter de trop dézoomer
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 6378

displayBuildings(viewer)
lookAtSummit(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')
showPyramid(viewer, 6.538256684, 46.851793418, 1662.2, 'Chasseron')

/***********************************************************************
 *
 * OOOOOOOOO  LLL
 * OOOOOOOOO  LLL
 * OO     OO  LLL
 * OO     OO  LLL
 * OO     OO  LLL
 * OO     OO  LLL
 * OOOOOOOOO  LLLLLLLLL
 * OOOOOOOOO  LLLLLLLLL
 *
 **********************************************************************/

// Initialisation de la map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        projection: 'EPSG:2056',
        url: 'https://wms.geo.admin.ch/',
        params: { layers: 'ch.swisstopo.pixelkarte-farbe' },
        attributions: [
          '&copy; <a href="https://www.geo.admin.ch/fr/home.html">WMTS CarteNationale / geo.admin.ch</a>'
        ]
      }),
      opacity: 1
    })
  ],
  view: new ol.View({
    center: [2660156.229, 1183629.32], // Centre géographique de la Suisse (https://www.myswitzerland.com/fr-ch/decouvrir/le-centre-de-la-suisse/)
    projection: new ol.proj.Projection({
      code: 'EPSG:2056',
      units: 'm'
    }),
    zoom: 8,
    maxZoom: 9.5
  })
})

// Initialisation des layers
const marker_source = new ol.source.Vector()
const marker_layer = new ol.layer.Vector({
  source: marker_source
})
marker_layer.setZIndex(1)
map.addLayer(marker_layer)

// Gestionnaire d'événement liée à la carte OpenLayers
map.on('click', function (event) {
  const coords = event.coordinate

  // Vider les features
  const features = marker_source.getFeatures()
  if (features.length >= 1) {
    marker_source.clear()
  }

  // Créer un marqueur à la position cliquée
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coords)
  })
  marker.setId('marker')

  // Définir une icône personnalisée (facultatif)
  marker.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon({
        src: '../src/img/marker.svg',
        scale: 0.08,
        anchor: [0.5, 0.9]
      })
    })
  )
  // Ajouter le marqueur à la source de vecteur
  marker_source.addFeature(marker)

  // Activer le bouton
  document.getElementById('validateSummit').disabled = false
})

/***********************************************************************
 *
 * MM     MM  AAAAAAAAA  III NN     NN
 * MMM   MMM  AAAAAAAAA  III NNN    NN
 * MM MMM MM  AA     AA  III NNN    NN
 * MM  M  MM  AA     AA  III NN N   NN
 * MM     MM  AAAAAAAAA  III NN  N  NN
 * MM     MM  AA     AA  III NN   N NN
 * MM     MM  AA     AA  III NN    NNN
 * MM     MM  AA     AA  III NN     NN
 *
 **********************************************************************/

function input_username () {
  let person = prompt('Entrez votre nom:', username)
  while (
    person == null ||
    person == '' ||
    person == 'Anonyme' ||
    person.length > 40
  ) {
    person = prompt('Entrez votre nom:', username)
  }
  username = person
  document.getElementById('joueurName').innerText = username
  return username
}

// Fonction pour lire le fichier JSON et retourner les données
async function fetchJSON () {
  try {
    // Utilise fetch pour récupérer le fichier JSON
    const response = await fetch('../src/summit.json')

    // Vérifie si la requête a réussi
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }

    // Convertit la réponse en objet JavaScript
    const data = await response.json()

    // Retourne les données
    return data
  } catch (error) {
    // Gère les erreurs éventuelles
    console.error('There has been a problem with your fetch operation:', error)
    throw error
  }
}

function computePoints (longueur) {
  let points = parseFloat(document.getElementById('joueurScore').innerText)
  let points_partie = (-0.1 * longueur) / 1000 + 50

  // check indice
  if (indices_list.length == 1) {
    points_partie -= 10
  }
  if (indices_list.length == 0) {
    points_partie -= 10
  }
  if (points <= 10) {
    points_partie = 0
  }

  document.getElementById('points').innerText = points_partie.toFixed(0)
  points += points_partie
  document.getElementById('joueurScore').innerText = points.toFixed(0)
}

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
    //----- Openlayers
    const feature = marker_source.getFeatureById('marker')
    const feature_coord = feature.getGeometry().getCoordinates()
    const coord_vrai = [2531332.62, 1189357.1]

    // Afficher la ligne entre les deux points
    const feature_line = new ol.Feature({
      geometry: new ol.geom.LineString([feature_coord, coord_vrai])
    })
    feature_line.setStyle(
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FF0000',
          width: 5,
          lineDash: [3, 10]
        })
      })
    )
    marker_source.addFeature(feature_line)

    // Afficher la longueur de la ligne
    // Calculez la longueur de la ligne
    const length = feature_line.getGeometry().getLength()
    const lengthFormatted = (length / 1000).toFixed(2) + ' km'
    const midPoint = feature_line.getGeometry().getCoordinateAt(0.5) // Obtenez le point au milieu de la ligne
    const textFeature = new ol.Feature({
      geometry: new ol.geom.Point(midPoint),
      name: lengthFormatted
    })
    textFeature.setStyle(
      new ol.style.Style({
        text: new ol.style.Text({
          text: lengthFormatted,
          font: '16px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#000',
            width: 1
          }),
          offsetY: 15 // Décalage vertical pour positionner le texte au-dessus de la ligne
        })
      })
    )
    marker_source.addFeature(textFeature)

    // Afficher le vrai sommet
    const feature_vrai = new ol.Feature({
      geometry: new ol.geom.Point(coord_vrai)
    })
    feature_vrai.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          src: '../src/img/marker.svg',
          scale: 0.08,
          anchor: [0.5, 0.9],
          color: '#000000'
        })
      })
    )
    marker_source.addFeature(feature_vrai)

    // Autoriser le zoom max
    map.getView().setMaxZoom(16)

    // Autoriser le click sur bouton suivant
    document.getElementById('indice').disabled = true
    document.getElementById('validateSummit').disabled = true
    document.getElementById('buttonSuivant').disabled = false

    // Affiche le score et la réponse
    document.getElementById('reponse').innerText =
      feature_coord[0].toFixed(2) + ', ' + feature_coord[1].toFixed(2)
    document.getElementById('ecart').innerText = lengthFormatted
    computePoints(length)

    //------ Cesium
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

document.getElementById('buttonSuivant').addEventListener('click', function () {
  // Delete features on map openlayers
  const features_ol = marker_source.getFeatures()
  features_ol.forEach(feature => {
    marker_source.removeFeature(feature)
  })

  //Delete feature on map3D
  viewer.entities.removeAll()
  viewer.scene.primitives.removeAll()
  displayBuildings(viewer)

  // Change summit
  // change label
  //
})

// Dès que la page est chargée
document.addEventListener('DOMContentLoaded', function () {
  input_username()

  // Charger le fichier de sommets
  fetchJSON()
    .then(data => {
      indices_list = data
    })
    .catch(error => {
      console.error('Fetch JSON failed:', error)
    })
})
