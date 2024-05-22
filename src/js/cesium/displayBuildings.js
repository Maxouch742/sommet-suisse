// 3DTiles TLM3d buildings
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
