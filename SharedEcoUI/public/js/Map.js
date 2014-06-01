var map;
require(["esri/map", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/layers/LabelLayer", "esri/symbols/PictureMarkerSymbol",
"esri/symbols/Font", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/TextSymbol", "esri/renderers/SimpleRenderer", "dijit/TooltipDialog", "dojo/_base/Color",
"dijit/popup", "dojo/domReady!"],
    function (Map, InfoTemplate, FeatureLayer, LabelLayer, PictureMarkerSymbol, Font, SimpleMarkerSymbol, TextSymbol, SimpleRenderer, TooltipDialog, Color, dijitPopup) {

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
		bcycleTemplate = $("#bcycle_view");
		bcycleTemplate = _.template( bcycleTemplate.html() );
		var bcycleInfoTemplate = new InfoTemplate({
			title: "B-Cycle ${STATION_NA}",
			content: bcycleTemplate({
				'street' : '${ADDRESS_LI}',
				'city' : '${CITY}',
				'state' : '${STATE}',
				'zip' : '${ZIP}',
				'docs' : '${NUM_DOCKS}',
			})
		});

		pnrTemplate = $('#pnr_view');
		pnrTemplate = _.template( pnrTemplate.html() );
		var pnrInfoTemplate = new InfoTemplate();
		pnrData = function(graphic) {
			pnrObj = {
				'street' : graphic.attributes.ADDRESS,
				'city' : graphic.attributes.CITY,
				'state' : 'CO',
				'zip' : graphic.attributes.ZIPCODE,
				'routes' : {
					'local' : graphic.attributes.LOCAL_RT,
					'express' : graphic.attributes.EXPRESS_RT,
					'limited' : graphic.attributes.LIMITED_RT,
					'regional' : graphic.attributes.REGIONAL_R,
					'skyride' : graphic.attributes.SKYRIDE_RT,
					'lightrail' : graphic.attributes.LINE
				},
				'parking' : graphic.attributes.AUTOS,
				'racks' : graphic.attributes.RACKS,
				'lockers' : graphic.attributes.LOCKERS,
				'shelters' : graphic.attributes.SHELTERS
			};
			return pnrTemplate(pnrObj);
		};
		pnrInfoTemplate.setTitle('PNR ${NAME}');
		pnrInfoTemplate.setContent(pnrData);

        var rtdInfoTemplate = new InfoTemplate({
            title: "${NAME}",
            content: "<b>Address:</b> ${ADDRESS}<br/>"
        });

        //Set up the tooltip for hovering over points
        var dialog = new TooltipDialog({
            id: "tooltipDialog",
        });
        dialog.startup();
        
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
            infoTemplate: pnrInfoTemplate,
            outFields: ['NAME', 'ADDRESS', 'CITY', 'ZIPCODE', 'PID', 'CLASS', 'LOCAL_RT', 'EXPRESS_RT', 'LIMITED_RT', 'REGIONAL_R', 'SKYRIDE_RT', 'LINE', 'AUTOS', 'RACKS', 'LOCKERS', 'SHELTERS']


        });
        pnrLayer.renderer = pnrRenderer;

        lightRailStationLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/2", {
            id: "lightrailstations",
            mode: FeatureLayer.MODE_ONDEMAND,
            infoTemplate: rtdInfoTemplate,
            outFields: ['NAME', 'ADDRESS']
        });
        lightRailStationLayer.renderer = rtdLightRailStationRenderer;

        bikeRouteLayer = new FeatureLayer("http://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/BruceSharedTransportation/FeatureServer/4", {
            id: "bikeroutelines",
            mode: FeatureLayer.MODE_ONDEMAND
        });

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

		map.addLayers([neighborhoodLayer, councilLayer, lightRailLayer, bikeRouteLayer, pnrLayer,
            neighborhoodLabelLayer, councilLabelLayer, lightRailStationLayer, busStopLayer, bikeRackLayer, bCycleLayer]);

    });