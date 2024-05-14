// My access token at: https://ion.cesium.com/tokens
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID
// and add the option to get a terrain
// https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
const viewer = new Cesium.Viewer('cesium-container', {
    // Terrain Swissgeol 
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: "https://download.swissgeol.ch/cli_terrain/ch-2m/",
        availableLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19],
        rectangle: Cesium.Rectangle.fromDegrees(7.13725, 47.83080, 10.44270, 45.88465),
    }),
    // Imagery WMTS geo.admin.ch
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url:'https://wmts{s}.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe-pk25.noscale/default/current/4326/{z}/{x}/{y}.jpeg',
        subdomains: "56789",
        availableLevels: [8, 10, 12, 14, 15, 16, 17, 18],
        minimumRetrievingLevel: 8,
        maximumLevel: 17,
        tilingScheme: new Cesium.GeographicTilingScheme({
            numberOfLevelZeroTilesX: 2,
            numberOfLevelZeroTilesY: 1,
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
    imageryProvider : false, 
    infoBox: false,
    selectionIndicator: false 
});

// 3DTiles TLM3d buildings
async function displayBuildings() {
    const buildings = await Cesium.Cesium3DTileset.fromUrl(
      "https://vectortiles0.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20180716/tileset.json", {
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true
    });
    viewer.scene.primitives.add(buildings);
  }
  displayBuildings();

  viewer.camera.flyTo({ // HES-SO Master
    destination: Cesium.Cartesian3.fromDegrees(6.60798, 46.51874, 600),
    orientation: {
      heading: Cesium.Math.toRadians(15),  // ↔ -gauche / +droite
      pitch: Cesium.Math.toRadians(-25),   // ↕ -sol / +ciel
      roll: Cesium.Math.toRadians(0)      // +penche droite
    }
  });
  viewer.camera.completeFlight();