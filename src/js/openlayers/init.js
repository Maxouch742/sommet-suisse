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
    zoom: 8
  })
})
