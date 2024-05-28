/***********************************************************************
 *
 * VARIABLES GLOBALES
 *
 **********************************************************************/

// Nom temporaire du joueur
let username = 'Anonyme'

// Variables pour lire le fichier 'summit.json'
let summits = []
let summit = {}
let indices_list = []
let entities_list = []

// Empecher l'utilisateur de cliquer sur la map, une fois qu'il a cliqué sur le bouton 'Valider'
let click_on_map = true

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

/**
 * Afficher le modèle swissTLM3D dans le viewer Cesium
 * @param {Object} viewer
 */
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

/**
 * Permet de déplacer la caméra sur le sommet en question,
 * et bloquer la translation de la camera
 * @param {Object} viewer
 * @param {Number} longitude
 * @param {Number} latitude
 * @param {Number} altitude
 * @param {String} name
 */
function lookAtSummit (viewer, longitude, latitude, altitude, name) {
  const point = Cesium.Cartesian3.fromDegrees(
    longitude,
    latitude,
    altitude - 50
  )

  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(point)
  viewer.scene.camera.lookAtTransform(
    transform,
    new Cesium.HeadingPitchRange(0, -Math.PI / 7, 150)
  )
}

/**
 * Créer une pyramide (primitive) à afficher au sommet de la montage,
 * pour mettre en évidence le sommet adéquat
 * Source: ChatGPT
 * @param {Object} viewer
 * @param {Number} longitude
 * @param {Number} latitude
 * @param {Number} altitude
 * @param {String} name
 */
function showPyramid (viewer, longitude, latitude, altitude, name) {
  // Define the vertices for the pyramid base (a square) and the apex
  var baseHeight = 0.0 // Height of the base of the pyramid
  var apexHeight = 10.0 // Height of the apex of the pyramid

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
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK)
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

// Definition du viewer Cesium
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
  infoBox: true,
  selectionIndicator: false
})
// Blocage de la distance maximale pour éviter de trop dézoomer
viewer.scene.screenSpaceCameraController.maximumZoomDistance = 6378

// IMPORTANT: batiment invisble à travers le terrain
viewer.scene.globe.depthTestAgainstTerrain = true

// Afficher les bâtiments.
displayBuildings(viewer)

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

// Initialisation du layer de la map OpenLayers
const marker_source = new ol.source.Vector()
const marker_layer = new ol.layer.Vector({
  source: marker_source
})
marker_layer.setZIndex(1)
map.addLayer(marker_layer)

// Gestionnaire d'événement liée à la carte OpenLayers
map.on('click', function (event) {
  if (click_on_map === true) {
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
          src: 'https://maxouch742.github.io/sommet-suisse/src/img/marker.svg',
          scale: 0.08,
          anchor: [0.5, 0.9]
        })
      })
    )
    // Ajouter le marqueur au layer
    marker_source.addFeature(marker)

    // Activer le bouton 'Valider'
    document.getElementById('validateSummit').disabled = false
  }
})

/***********************************************************************
 *
 * MM     MM  AAAAAAAAA  III  NN     NN
 * MMM   MMM  AAAAAAAAA  III  NNN    NN
 * MM MMM MM  AA     AA  III  NNN    NN
 * MM  M  MM  AA     AA  III  NN N   NN
 * MM     MM  AAAAAAAAA  III  NN  N  NN
 * MM     MM  AA     AA  III  NN   N NN
 * MM     MM  AA     AA  III  NN    NNN
 * MM     MM  AA     AA  III  NN     NN
 *
 **********************************************************************/

/**
 * Gérer l'entrée du nom de l'utilisateur
 */
function input_username () {
  let person = prompt('Entrez votre nom:', username)

  // Boucle de contrôle pour obtenir un nom pas générique
  while (
    person == null ||
    person == '' ||
    person == 'Anonyme' ||
    person == undefined
  ) {
    person = prompt('Entrez votre nom:', username)
  }

  // Afficher le nom et retourner le nom
  username = person
  document.getElementById('joueurName').innerText = username
}

/**
 * Incrémenter le numéro de la question
 */
function incrementNumber () {
  // récupérer le numéro actuel
  let numb = parseFloat(document.getElementById('questionNombre').innerText)
  numb += 1
  // afficher le numéro incrémenté
  document.getElementById('questionNombre').innerText = numb
}

/**
 * Création d'une chaîne de caractères pour afficher un tableau avec toutes les données de la description de l'indice et qui s'affichera dans l'infoBox de Cesium
 * @param {Object} indice
 * @returns {String}
 */
function createDescription (indice) {
  let table = `<table class='table table-bordered table-dark table-striped .bg-black'>
        <thead><tr>
          <th scope="col">Item</th><th scope="col">Description</th>
        </tr></thead>
        <tbody>
          <tr>
            <td>Commune :</td><td>${indice.name}</td>
          </tr>
          <tr>
            <td>Canton :</td><td>${indice.description.canton}</td>
          </tr>`

  // On ajuste le contenu du tableau en fonction des entrées du json et des cantons
  if (indice.description.region != undefined) {
    table += `<tr>
      <td>Région :</td><td>${indice.description.region}</td>
    </tr>`
  } else {
    table += `<tr>
      <td>District :</td><td>${indice.description.district}</td>
    </tr>`
  }

  // On ajuste le contenu du tableau en fonction du nom du syndic (selon canton)
  if (indice.description.syndic != undefined) {
    table += `<tr><td>Syndic :</td><td>${indice.description.syndic}</td></tr>`
  } else if (indice.description.maire != undefined) {
    table += `<tr><td>Maire :</td><td>${indice.description.maire}</td></tr>`
  } else if (indice.description.president != undefined) {
    table += `<tr><td>Président :</td><td>${indice.description.president}</td></tr>`
  }

  table += `<tr>
          <td>NPA :</td><td>${indice.description.NPA}</td>
        </tr>
        <tr>
          <td>Armoirie :</td><td><a href="${indice.description.armoiries}" target='_blank'>link</a></td>
        </tr>
      </tbody>
    </table>`
  return table
}

/**
 * Lire le fichier JSON des sommets de montages et retourner le contenu
 * Source: ChatGPT
 * @returns {String}
 */
async function fetchJSON () {
  try {
    // Utilise fetch pour récupérer le fichier JSON
    const response = await fetch(
      'https://maxouch742.github.io/sommet-suisse/src/summit.json'
    )

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

/**
 * Conversion des coordonnées suisses (système MN95) en coordonnées
 * globabes (système WGS84) grâce à l'API Reframe de swisstopo
 * @param {Number} east
 * @param {Number} north
 * @param {Number} altitude
 * @returns {Object}
 */
async function mn95ToWgs84 (east, north, altitude) {
  const response = await fetch(
    `https://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=${east}&northing=${north}&altitude=${altitude}&format=json`,
    {
      method: 'GET'
    }
  )
  const result = await response.json()
  return result
}

/**
 *
 * Conversion de l'altitude usuelle (système NF02) en hauteur
 * ellipsoïdale (ellipsoïde Bessel 1941) grâce à l'API Reframe
 * de swisstopo
 * @param {Number} east
 * @param {Number} north
 * @param {Number} altitude
 * @returns {Object}
 */
async function nf02ToBessel (east, north, altitude) {
  const response = await fetch(
    `https://geodesy.geo.admin.ch/reframe/ln02tobessel?easting=${east}&northing=${north}&altitude=${altitude}&format=json`,
    {
      method: 'GET'
    }
  )
  const result = await response.json()
  return result
}

/**
 * Permet de convertir les coordonnées (E,N,H_NF02) en coordonnées
 * globales WGS84
 * @param {Number} easting
 * @param {Number} northing
 * @param {Number} altitude
 * @returns {Object}
 */
async function fetchREFRAME (easting, northing, altitude) {
  // NF02 to Bessel
  const height_bessel = await nf02ToBessel(easting, northing, altitude)

  // MN95 to WGS84
  const wgs84 = await mn95ToWgs84(
    easting,
    northing,
    parseFloat(height_bessel.altitude)
  )

  // Création du dictionnaire de réponse
  const response = {
    longitude: parseFloat(wgs84.easting),
    latitude: parseFloat(wgs84.northing),
    altitude: parseFloat(wgs84.altitude)
  }
  return response
}

/**
 * Calcul du nombre de points correspondants à l'écart, et affichage
 * des scores et nombres de points
 * @param {Number} longueur
 */
function computePoints (longueur) {
  // Récupérer le score actuel
  let points = parseFloat(document.getElementById('joueurScore').innerText)

  // Calcul du nombre de points
  let points_partie = -0.1 * (longueur / 1000) + 50
  // Calcul du nombre de points en fonction de l'utilisation des indices
  if (indices_list.length == 1) {
    points_partie -= 10
  }
  if (indices_list.length == 0) {
    points_partie -= 10
  }

  // Affichage des données
  document.getElementById('points').innerText = points_partie.toFixed(0)
  points += points_partie
  document.getElementById('joueurScore').innerText = points.toFixed(0)
}

/**
 * Gestion de l'affichage des indices quand l'utilisateur clique
 * sur le bouton 'Indice'
 */
document.getElementById('indice').addEventListener('click', function () {
  const indice = indices_list[0]

  // Conversion des coordonnées
  fetchREFRAME(indice.easting, indice.northing, indice.altitude).then(
    response => {
      // Récupérer la position convertit
      const position_indice = response
      indice.longitude = position_indice.longitude
      indice.latitude = position_indice.latitude
      indice.altitude = position_indice.altitude

      // Ajout du cone
      const cone = viewer.entities.add({
        id: indice.name + '_cone',
        position: Cesium.Cartesian3.fromDegrees(
          indice.longitude,
          indice.latitude,
          indice.altitude
        ),
        cylinder: {
          length: 500.0,
          topRadius: 500,
          bottomRadius: 1,
          material: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0,
          3000000
        )
      })

      // Ajout du cylindre
      const cylindre = viewer.entities.add({
        id: indice.name + '_cylindre',
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
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
          0,
          3000000
        ),
        name: indice.name,
        description: createDescription(indice)
      })

      entities_list.push(cone)
      entities_list.push(cylindre)

      // Creation du point objet 'Cesium' du sommet
      const point1 = Cesium.Cartesian3.fromDegrees(
        summit.longitude,
        summit.latitude,
        summit.altitude
      )
      const point1_transform = Cesium.Transforms.eastNorthUpToFixedFrame(point1)

      // Calculer le vecteur direction du Sommet vers l'indice
      const direction = Cesium.Cartesian3.subtract(
        point1,
        Cesium.Cartesian3.fromDegrees(
          indice.longitude,
          indice.latitude,
          indice.altitude
        ),
        new Cesium.Cartesian3()
      )
      Cesium.Cartesian3.normalize(direction, direction)

      // Calcul des angles yaw pitch and roll
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

      // Modification de l'orientation de la caméra
      viewer.scene.camera.lookAtTransform(
        point1_transform,
        new Cesium.HeadingPitchRange(yaw, pitch, 150)
      )

      // Ajout du nom de l'indice dans le champ associé
      document.getElementById('indice_text').innerHTML += ` ${indice.name},`

      // Supprimer l'indice de la liste
      indices_list.shift()

      // Désactiver l'indice car il en existe plus dans la liste
      if (indices_list.length < 1) {
        const button_indice = document.getElementById('indice')
        button_indice.disabled = true
      }
    }
  )
})

/**
 * Afficher la bonne réponse lorsque l'utilisateur clique sur
 * le bouton 'Valider'
 */
document
  .getElementById('validateSummit')
  .addEventListener('click', function () {
    // Récupérer les coordonnées cliqué de l'utilisateur et les coordonnées vrai du sommet
    const feature = marker_source.getFeatureById('marker')
    const feature_coord = feature.getGeometry().getCoordinates()
    const coord_vrai = [summit.easting, summit.northing]

    // Afficher la ligne entre les deux points dans la carte openlayers
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

    // Afficher un marker pour montrer la position du vrai sommet
    const feature_vrai = new ol.Feature({
      geometry: new ol.geom.Point(coord_vrai)
    })
    feature_vrai.setStyle(
      new ol.style.Style({
        text: new ol.style.Text({
          text: summit.name,
          font: '16px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#000',
            width: 1
          }),
          offsetY: 15
        }),
        image: new ol.style.Icon({
          src: 'https://maxouch742.github.io/sommet-suisse/src/img/marker.svg',
          scale: 0.08,
          anchor: [0.5, 0.9],
          color: '#000000'
        })
      })
    )
    marker_source.addFeature(feature_vrai)

    // Autoriser le zoom max sur la carte
    map.getView().setMaxZoom(16)

    // Autoriser le click sur bouton suivant et désactiver les autres boutons
    document.getElementById('indice').disabled = true
    document.getElementById('validateSummit').disabled = true
    document.getElementById('buttonSuivant').disabled = false

    // Bloquer le fait de pouvoir recliquer sur la map
    click_on_map = false

    // Affiche le score et la réponse
    document.getElementById('reponse').innerText =
      feature_coord[0].toFixed(2) + ', ' + feature_coord[1].toFixed(2)
    document.getElementById('ecart').innerText = lengthFormatted
    computePoints(length)

    //------ Cesium
    // Ajout d'un cylindre noir pour montrer la position exacte du sommet
    const entity_summit = viewer.entities.add({
      id: summit.name,
      position: Cesium.Cartesian3.fromDegrees(
        summit.longitude,
        summit.latitude,
        summit.altitude
      ),
      cylinder: {
        length: 200.0,
        topRadius: 0.2,
        bottomRadius: 0.2,
        material: Cesium.Color.BLACK,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
      label: {
        text: summit.name,
        fillColor: Cesium.Color.WHITE,
        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT
      }
    })
    entities_list.push(entity_summit)
  })

/**
 * Permet de réinitialiser les différents textes et affichages (map
 * openlayers et cesium) lorsque l'utilisateur veut passer à la
 * question suivante
 */
document.getElementById('buttonSuivant').addEventListener('click', function () {
  // Si le bouton 'Suivant' a un texte 'Fin', on affiche le résultat final car le jeu est fini
  if (document.getElementById('buttonSuivant').innerText === 'Fin') {
    const points = document.getElementById('joueurScore').innerText
    alert(`Vous avez terminé ! Votre score est de ${points} points`)

    // Retourner au menu home
    window.location.href = 'https://maxouch742.github.io/sommet-suisse/'
  }

  // Suppression de l'ensemble des objets sur la carte Openlayers
  const features_ol = marker_source.getFeatures()
  features_ol.forEach(feature => {
    marker_source.removeFeature(feature)
  })

  // Suppression des entités créés pour les indices et le sommetok
  entities_list.forEach(function (entity) {
    console.log(entity.id)
    viewer.entities.remove(entity)
  })

  // Suppression des éléments liés à la réponse de question
  document.getElementById('points').innerText = ''
  document.getElementById('reponse').innerText = ''
  document.getElementById('ecart').innerText = ''
  document.getElementById('indice_text').innerText = 'Indice :'

  // Désactiver les boutons
  document.getElementById('indice').disabled = false
  document.getElementById('validateSummit').disabled = true
  document.getElementById('buttonSuivant').disabled = true
  incrementNumber()

  // Réinitialiser la vue de la carte Openlayers
  map.getView().setMaxZoom(9.5)
  map.getView().setZoom(8)
  map.getView().setCenter([2660156.229, 1183629.32])
  click_on_map = true

  // S le numero de la question est 4, alors on change le button pour signaler la fin du jeu
  if (document.getElementById('questionNombre').innerText === '4') {
    document.getElementById('buttonSuivant').innerText = 'Fin'
  }

  // Chercher les informations du prochain sommet
  summits.shift()
  summit = summits[0]
  indices_list = summit.indices

  // Convertir les coordonnées du prochain sommet
  fetchREFRAME(summit.easting, summit.northing, summit.altitude).then(
    response => {
      const position_summit = response

      // Ajout des coordonnées dans l'Objet lié au sommet
      summit.latitude = position_summit.latitude
      summit.longitude = position_summit.longitude
      summit.altitude = position_summit.altitude

      // Afficher le sommet
      lookAtSummit(
        viewer,
        position_summit.longitude,
        position_summit.latitude,
        position_summit.altitude,
        summit.name
      )
      // Dessiner la pyramide en haut du sommet
      showPyramid(
        viewer,
        position_summit.longitude,
        position_summit.latitude,
        position_summit.altitude,
        summit.name
      )
    }
  )
})

// Dès que la page est chargée complètement, on affiche les éléments de la première question
document.addEventListener('DOMContentLoaded', function () {
  // On souhaite que l'utilisateur entre son nom de joueur
  input_username()

  // Charger le fichier de sommets
  fetchJSON()
    .then(data => {
      summits = data
      summit = summits[0]
      indices_list = summit.indices

      // convert data
      fetchREFRAME(summit.easting, summit.northing, summit.altitude).then(
        response => {
          const position_summit = response

          // Ajout des coordonnées dans l'Objet lié au sommet
          summit.latitude = position_summit.latitude
          summit.longitude = position_summit.longitude
          summit.altitude = position_summit.altitude

          // Afficher le sommet
          lookAtSummit(
            viewer,
            position_summit.longitude,
            position_summit.latitude,
            position_summit.altitude,
            summit.name
          )
          // Dessiner la pyramide en haut du sommet
          showPyramid(
            viewer,
            position_summit.longitude,
            position_summit.latitude,
            position_summit.altitude,
            summit.name
          )

          // increment question
          incrementNumber()
        }
      )
    })
    .catch(error => {
      console.error('Fetch JSON failed:', error)
    })
})
