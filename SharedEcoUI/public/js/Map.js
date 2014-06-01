var map;
require(["esri/map", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/layers/LabelLayer", "esri/symbols/PictureMarkerSymbol",
"esri/symbols/Font", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/TextSymbol", "esri/symbols/SimpleLineSymbol",
"esri/renderers/SimpleRenderer", "dijit/TooltipDialog", "dojo/_base/Color", "esri/dijit/Geocoder",
"esri/tasks/query", "dijit/popup", "dojo/domReady!"],
    function (Map, InfoTemplate, FeatureLayer, LabelLayer, PictureMarkerSymbol, Font, SimpleMarkerSymbol, TextSymbol, SimpleLineSymbol,
        SimpleRenderer, TooltipDialog, Color, Geocoder, Query, dijitPopup) {

        map = new Map("map", {
            basemap: "streets",
            center: [-104.963767, 39.724628],
            zoom: 12,
            slider: true,
            sliderStyle: "small"
        });

        geocoder = new Geocoder({
            map: map,
            autoComplete: true,
            arcgisGeocoder: true,
            minCharacters: 3,
            maxLocations: 3,
            theme: "arcgisGeocoder"
        }, "geocoder");

        geocoder.startup();

        var bikeRackRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bikeRack.png', 26, 36));
        var busStopRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bus.png', 25, 36));
        var pnrRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/parknride.png', 25, 36));
        var rtdLightRailStationRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/lightrail.png', 25, 36));
        var bCycleRenderer = new SimpleRenderer(new PictureMarkerSymbol('./public/Images/bcycle.png', 25, 36));

        //Set up the tooltip for hovering over points
        var dialog = new TooltipDialog({
            id: "tooltipDialog",
        });
        dialog.startup();

		//Set up the pop up for displaying additional information about a point
		bcycleTemplate = $("#bcycle_view");
		bcycleTemplate = _.template( bcycleTemplate.html() );
		var bcycleInfoTemplate = new InfoTemplate();
		bcycleInfoTemplate.setTitle('B-Cycle ${STATION_NA}');
		bcycleInfoTemplate.setContent(function(graphic) {
			bcycleObj = {
				'street' : graphic.attributes.ADDRESS_LI,
				'city' : graphic.attributes.CITY,
				'state' : graphic.attributes.STATE,
				'zip' : graphic.attributes.ZIP,
				'docs' : graphic.attributes.NUM_DOCKS
			};
			return bcycleTemplate(bcycleObj);
		});

		rtdTemplate = $('#pnr_view');
		rtdTemplate = _.template( rtdTemplate.html() );
		rtdInfoTemplate = new InfoTemplate();
		rtdInfoTemplate.setTitle(function(graphic){
			if (graphic.attributes.CLASS) {
				var locName = graphic.attributes.CLASS
			} else if (graphic.attributes.STOPNAME) {
				var locName = 'Stop'
			} else {
				var locName = 'LRT'
			}
			return locName + ' ' + (graphic.attributes.NAME ? graphic.attributes.NAME : graphic.attributes.STOPNAME);
		});
		rtdInfoTemplate.setContent(function(graphic) {
			var queryString = '';
			if (graphic.attributes.LOCAL_RT && graphic.attributes.LOCAL_RT !== ' ') queryString += graphic.attributes.LOCAL_RT + '-';
			if (graphic.attributes.EXPRESS_RT && graphic.attributes.EXPRESS_RT !== ' ') queryString += graphic.attributes.EXPRESS_RT + '-';
			if (graphic.attributes.LIMITED_RT && graphic.attributes.LIMITED_RT !== ' ') queryString += graphic.attributes.LIMITED_RT + '-';
			if (graphic.attributes.REGIONAL_R && graphic.attributes.REGIONAL_R !== ' ') queryString += graphic.attributes.REGIONAL_R + '-';
			if (graphic.attributes.SKYRIDE_RT && graphic.attributes.SKYRIDE_RT !== ' ') queryString += graphic.attributes.SKYRIDE_RT + '-';
			if (graphic.attributes.ROUTES && graphic.attributes.ROUTES !== ' ') queryString += graphic.attributes.ROUTES;
			
			queryString = queryString.replace(/, /g, '-');
			queryString = queryString.replace(/-/g, '#');
			queryString = queryString.replace(/#/g, '","');
			queryString = '"' + queryString + '"';
			queryString = queryString.replace(/,\"\"/g, '');
			
			rtdInfoTemplate.queryString = queryString;

			pnrObj = {
				'street' : (graphic.attributes.ADDRESS ? graphic.attributes.ADDRESS : graphic.attributes.STOPNAME),
				'city' : graphic.attributes.CITY,
				'state' : 'CO',
				'zip' : graphic.attributes.ZIPCODE,
				'routes' : {
					'local' : graphic.attributes.LOCAL_RT,
					'express' : graphic.attributes.EXPRESS_RT,
					'limited' : graphic.attributes.LIMITED_RT,
					'regional' : graphic.attributes.REGIONAL_R,
					'skyride' : graphic.attributes.SKYRIDE_RT,
					'lightrail' : graphic.attributes.LINE,
					'routes' : graphic.attributes.ROUTES,
					'queryString' : queryString
				},
				'parking' : graphic.attributes.AUTOS,
				'racks' : graphic.attributes.RACKS,
				'lockers' : graphic.attributes.LOCKERS,
				'shelters' : graphic.attributes.SHELTERS
			};
			
			return rtdTemplate(pnrObj);
			
		});

		var selectionSymbol = new SimpleLineSymbol().setColor(new Color("#000080"));
		var featureLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/RTDBusRoutes500k/FeatureServer/0", {
		    id: "filterBusRoutes",
		    outFields: ['ROUTE']
		});

		featureLayer.setDefinitionExpression("ROUTE = ''");
		featureLayer.on("mouse-over", function (e) {
		    dialog.setContent("Route " + e.graphic.attributes.ROUTE);
		    dijitPopup.open({
		        popup: dialog,
		        x: e.pageX,
		        y: e.pageY
		    });
		});

		featureLayer.on("mouse-out", function () {
		    dijitPopup.close(dialog);
		});

		map.addLayer(featureLayer);

		rtdInfoTemplate.getBusRoutes = function () {
			console.log(rtdInfoTemplate.queryString);
			var queryString = rtdInfoTemplate.queryString.replace(/\"/g, '\'');
			console.log(queryString);

			map.removeLayer(featureLayer);

			featureLayer.setDefinitionExpression("ROUTE IN (" + queryString + ")");

			map.addLayer(featureLayer);
		}

        bikeRackLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/3", {
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

        busStopLayer = new FeatureLayer("http://services.arcgis.com/IZtlGBUe4KTzLOl4/ArcGIS/rest/services/BPX_RTD_BusStops3/FeatureServer/0", {
            id: "busStops",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['STOPNAME', 'ROUTES']
        });
        busStopLayer.renderer = busStopRenderer;
        busStopLayer.minScale = "40000";

        pnrLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/1", {
            id: "pnr",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS', 'CLASS', 'CITY', 'ZIPCODE', 'LOCAL_RT', 'EXPRESS_RT', 'LIMITED_RT', 'REGIONAL_R', 'SKYRIDE_RT', 'LINE', 'AUTOS', 'RACKS', 'LOCKERS', 'SHELTERS']
        });

        pnrLayer.renderer = pnrRenderer;

        lightRailStationLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/2", {
            id: "lightrailstations",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS', 'AUTOS', 'RACKS', 'LOCKERS', 'SHELTERS']
        });
        lightRailStationLayer.renderer = rtdLightRailStationRenderer;
        
        bikeRouteLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/4", {
            id: "bikeroutelines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

        busRouteLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/RTDBusRoutes/FeatureServer/0", {
            id: "busroutelines",
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ['ROUTE']
        });

        busRouteLayer.on("mouse-over", function (e) {
            dialog.setContent("Route " + e.graphic.attributes.ROUTE);
            dijitPopup.open({
                popup: dialog,
                x: e.pageX,
                y: e.pageY
            });
        });

        busRouteLayer.on("mouse-out", function () {
            dijitPopup.close(dialog);
        });
        
        //busRouteLayer.setSelectionSymbol(selectionSymbol);

        lightRailLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/5", {
            id: "lightraillines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

		bCycleLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/0", {
			id: "bcyclelocations",
			mode: FeatureLayer.MODE_ONDEMAND,
			infoTemplate: bcycleInfoTemplate,
			outFields: ['STATION_NA', 'ADDRESS_LI', 'CITY', 'STATE', 'ZIP', 'NUM_DOCKS']
		});
		bCycleLayer.renderer = bCycleRenderer;

        councilLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/6", {
            id: "councildistricts",
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ['DIST_REP']
        });

        var councilLabelLayer = new LabelLayer();
        var color = new Color("#666");
        var font = new Font("12pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Arial");
        var textSymbol = new TextSymbol();
        textSymbol.setFont(font);
        textSymbol.setColor(color);
        var councilLabelRenderer = new SimpleRenderer(textSymbol);
        councilLabelLayer.addFeatureLayer(councilLayer, councilLabelRenderer, "${DIST_REP}");
        councilLabelLayer.minScale = "100000";
        councilLabelLayer.maxScale = "40000"

		neighborhoodLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/8", {
		    id: "neighborhoods",
		    mode: FeatureLayer.MODE_ONDEMAND,
		    outFields: ['NBHD_NAME']
		});

		var neighborhoodLabelLayer = new LabelLayer();
		var color = new Color("#333");
		var font = new Font("12pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD,"Arial");
		var textSymbol = new TextSymbol();
		textSymbol.setFont(font);
		textSymbol.setColor(color);
		var neighborhoodLabelRenderer = new SimpleRenderer(textSymbol);
		neighborhoodLabelLayer.addFeatureLayer(neighborhoodLayer, neighborhoodLabelRenderer, "${NBHD_NAME}");
		neighborhoodLabelLayer.minScale = "40000";

		map.addLayers([neighborhoodLayer, councilLayer, busRouteLayer, lightRailLayer, bikeRouteLayer, neighborhoodLabelLayer,
            councilLabelLayer, lightRailStationLayer, pnrLayer, busStopLayer, bikeRackLayer, bCycleLayer]);


    });
