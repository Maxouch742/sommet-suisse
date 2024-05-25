// Initialisation de la map
map = new ol.Map({
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

marker_source = new ol.source.Vector()
marker_layer = new ol.layer.Vector({
  source: marker_source
})
map.addLayer(marker_layer)
console.log('map')

// Ajouter un gestionnaire d'événement pour les clics sur la carte
map.on('click', function (event) {
  const coords = event.coordinate

  // Vider les features
  const features = marker_source.getFeatures()
  if (features.length >= 1) {
    marker_source.clear()
  }

  // Créer un marqueur à la position cliquée
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coords),
    id: 'marker'
  })

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
})
