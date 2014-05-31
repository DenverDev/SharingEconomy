var map;
require(["esri/map", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/symbols/PictureMarkerSymbol",
"esri/renderers/SimpleRenderer", "dojo/domReady!"],
    function (Map, InfoTemplate, FeatureLayer, PictureMarkerSymbol, SimpleRenderer) {

        map = new Map("map", {
            basemap: "streets",
            center: [-104.963767, 39.724628],
            zoom: 12,
            slider: true,
            sliderStyle: "small"
        });
        var pnrRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/parknride.png', 24, 34));
        var rtdLightRailStationRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/lightrail.png', 24, 34));

        //Set up the pop up for displaying additional information about a point
        var rtdInfoTemplate = new InfoTemplate({
            title: "${NAME}",
            content: "<b>Address:</b> ${ADDRESS}<br/>"
        });

        var pnrLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/SharedTransportation/FeatureServer/0", {
            id: "pnr",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        pnrLayer.renderer = pnrRenderer;

        var lightRailStationLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/SharedTransportation/FeatureServer/1", {
            id: "lightrailstations",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        lightRailStationLayer.renderer = rtdLightRailStationRenderer;

        var lightRailLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/SharedTransportation/FeatureServer/4", {
            id: "lightraillines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

        map.addLayers([lightRailLayer, pnrLayer, lightRailStationLayer]);

    });