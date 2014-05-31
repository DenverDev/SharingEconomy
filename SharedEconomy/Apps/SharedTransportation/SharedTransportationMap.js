define('appMain', [
    "esri/map", "esri/layers/FeatureLayer",
    "esri/tasks/query", "dijit/TooltipDialog", "dijit/popup",
    "esri/graphic", "esri/InfoTemplate", "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer", "dijit/registry",
    "esri/config", "dojo/dom", "dijit/form/CheckBox",
    "dgrid/OnDemandGrid", "dgrid/Selection", "dojo/_base/declare",
    "dojo/_base/array", "dojo/store/Memory", "esri/dijit/Geocoder",
    "dojo/on", "dojo/parser", "dojo/domReady", "dijit/TitlePane"
], function (

    Map, FeatureLayer,
    Query, TooltipDialog, dijitPopup,
    Graphic, InfoTemplate, PictureMarkerSymbol,
    SimpleRenderer, registry,
    esriConfig, dom, CheckBox,
    OnDemandGrid, Selection, declare,
    arrayUtils, Memory, Geocoder, on, parser
){
    var map = null;
    //Set up the map
    map = new Map("mapDiv", {
        basemap: "streets",
        center: [-104.963767, 39.724628],
        zoom: 12,
        slider: true,
        sliderStyle: "small"
    });

})