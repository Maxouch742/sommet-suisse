// My access token at: https://ion.cesium.com/tokens
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNTExYzU1NS0yZDIwLTQ3NmQtODQ2ZS1lMTU5ODc0ZGQ3ZjMiLCJpZCI6MjA4Nzc2LCJpYXQiOjE3MTMxNjYyNTJ9.nsz9PBApdttEzJOyzSzj0JubJCIh_vs3I_MiLTVP4_Y";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID
// and add the option to get a terrain
// https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
const viewer = new Cesium.Viewer('cesium-container', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    baseLayer: Cesium.ImageryLayer.fromWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
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

// https://cesium.com/learn/cesiumjs/ref-doc/global.html#createOsmBuildingsAsync
const tileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(tileset);