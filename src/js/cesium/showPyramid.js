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
