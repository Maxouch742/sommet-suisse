document
  .getElementById('validateSummit')
  .addEventListener('click', function () {
    const feature = marker_source.getFeatureById('marker')
    const feature_coord = feature.getGeometry().getCoordinates()
    const coord_vrai = [2531332.62, 1189357.1]

    console.log(feature_coord)

    const feature_line = new ol.Feature({
      geometry: new ol.geom.LineString([feature_coord, coord_vrai])
    })
    feature_line.setStyle(
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FF0000',
          width: 5
        })
      })
    )
    marker_source.addFeature(feature_line)
    //TODO: line dashed, calculer la distance et l'afficher...
    console.log(marker_source)

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
  })
