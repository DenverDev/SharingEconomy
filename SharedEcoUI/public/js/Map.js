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
        var pnrRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/parknride.png', 25, 36));
        var rtdLightRailStationRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/lightrail.png', 25, 36));
        var bCycleRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bcycle.png', 25, 36));

        //Set up the pop up for displaying additional information about a point
        var rtdInfoTemplate = new InfoTemplate({
            title: "${NAME}",
            content: "<b>Address:</b> ${ADDRESS}<br/>"
        });

		infoTemplate = $("#info_view");
		infoTemplate = _.template( infoTemplate.html() );
		var bcycleInfoTemplate = new InfoTemplate({
			title: "${STATION_NA}",
			content: "${ADDRESS_LI}<br/>${NUM_DOCKS} Bike Docks<br/>"
		});

        var pnrLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/1", {
            id: "pnr",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        pnrLayer.renderer = pnrRenderer;

        var lightRailStationLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/2", {
            id: "lightrailstations",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        lightRailStationLayer.renderer = rtdLightRailStationRenderer;

        var lightRailLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/5", {
            id: "lightraillines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

		var bCycleLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/0", {
			id: "bcyclelocations",
			mode: FeatureLayer.MODE_ONDEMAND,
			infoTemplate: bcycleInfoTemplate,
			outFields: ['STATION_NA', 'ADDRESS_LI', 'CITY', 'STATE', 'ZIP', 'NUM_DOCKS']
		});
		bCycleLayer.renderer = bCycleRenderer;

        map.addLayers([lightRailLayer, pnrLayer, lightRailStationLayer, bCycleLayer]);

    });