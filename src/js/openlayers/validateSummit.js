document
  .getElementById('validateSummit')
  .addEventListener('click', function () {
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
  })
