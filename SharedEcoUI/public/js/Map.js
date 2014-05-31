var map;
require(["esri/map", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/symbols/PictureMarkerSymbol",
"esri/symbols/SimpleMarkerSymbol", "esri/renderers/SimpleRenderer", "dijit/TooltipDialog", "dijit/popup", "dojo/domReady!"],
    function (Map, InfoTemplate, FeatureLayer, PictureMarkerSymbol, SimpleMarkerSymbol, SimpleRenderer, TooltipDialog, dijitPopup) {

        map = new Map("map", {
            basemap: "streets",
            center: [-104.963767, 39.724628],
            zoom: 12,
            slider: true,
            sliderStyle: "small"
        });

        var bikeRackRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bikeRack.png', 26, 36));
        var busStopRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bus.png', 25, 36));
        var pnrRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/parknride.png', 25, 36));
        var rtdLightRailStationRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/lightrail.png', 25, 36));
        var bCycleRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bcycle.png', 25, 36));

        //Set up the pop up for displaying additional information about a point
		flyoutTemplate = $("#flyout_view");
		flyoutTemplate = _.template( flyoutTemplate.html() );
		var bcycleInfoTemplate = new InfoTemplate({
			title: "B-Cycle ${STATION_NA}",
			content: flyoutTemplate({
				'street' : '${ADDRESS_LI}',
				'city' : '${CITY}',
				'state' : '${STATE}',
				'zip' : '${ZIP}',
				'docs' : '${NUM_DOCKS}',
				'stuff' : ''
			})
		});

		var pnrInfoTemplate = new InfoTemplate({
			title: "B-Cycle ${STATION_NA}",
			content: flyoutTemplate({
				'street' : '${ADDRESS}',
				'city' : '${CITY}',
				'state' : 'CO',
				'zip' : '${ZIPCODE}',
				'docs' : '',
				'stuff' : 'a${PID} - b${CLASS} - c${LOCAL_RT} - d${EXPRESS_RT} - e${LIMITED_RT} - f${REGIONAL_R} - g${SKYRIDE_RT} - h${LINE} - h${AUTOS} - i${RACKS} - j${LOCKERS} - k${SHELTERS}'
			})
		});

        var rtdInfoTemplate = new InfoTemplate({
            title: "${NAME}",
            content: "<b>Address:</b> ${ADDRESS}<br/>"
        });

        //Set up the tooltip for hovering over points
        var dialog = new TooltipDialog({
            id: "tooltipDialog",
        });
        dialog.startup();
        
        var bikeRackLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/3", {
            id: "bikeracks",
            mode: FeatureLayer.MODE_ONDEMAND,
        });
        bikeRackLayer.renderer = bikeRackRenderer;
        bikeRackLayer.on("mouse-over", function (e) {
            dialog.setContent("Bike Rack");
            dijitPopup.open({
                popup: dialog,
                x: e.pageX,
                y: e.pageY
            });
        });

        bikeRackLayer.on("mouse-out", function () {
            dijitPopup.close(dialog);
        });

        var busStopLayer = new FeatureLayer("http://services.arcgis.com/IZtlGBUe4KTzLOl4/ArcGIS/rest/services/BPX_RTD_BusStops3/FeatureServer/0", {
            id: "pnr",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['STOPNAME', 'ROUTES']
        });
        busStopLayer.renderer = busStopRenderer;

        var pnrLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/1", {
            id: "pnr",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: pnrInfoTemplate,
            outFields: ['NAME', 'ADDRESS', 'CITY', 'ZIPCODE', 'PID', 'CLASS', 'LOCAL_RT', 'EXPRESS_RT', 'LIMITED_RT', 'REGIONAL_R', 'SKYRIDE_RT', 'LINE', 'AUTOS', 'RACKS', 'LOCKERS', 'SHELTERS']


        });
        pnrLayer.renderer = pnrRenderer;

        var lightRailStationLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/2", {
            id: "lightrailstations",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        lightRailStationLayer.renderer = rtdLightRailStationRenderer;

        var bikeRouteLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/4", {
            id: "bikeroutelines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

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

        map.addLayers([lightRailLayer, bikeRouteLayer, pnrLayer, lightRailStationLayer, busStopLayer, bikeRackLayer, bCycleLayer]);

    });