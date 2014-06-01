     function getCarToGo(loc,Scope){  

           $jQ = jQuery.noConflict();
           $jQ.ajax(
                {
                    type: "GET",
                    url: ('https://www.car2go.com/api/v2.1/parkingspots'),
                    data: {
                    	 loc:loc,
                         oauth_consumer_key: 'car2gowebsite',
                         format: 'json'
                         },
                    contentType: "application/json; charset=utf-8",
                    dataType: "jsonp",
                    success: function (data) {
                        var outData = '';
                        var togoArray = new Array();

                        //parse data into array
                           for (i = 0; i < Object.keys(data.placemarks).length; ++i) { 
                                var line = new Array();
                                line["lon"]    = data.placemarks[i].coordinates[0];
                                line["lat"]    = data.placemarks[i].coordinates[1];
                                line["pulgIn"] = data.placemarks[i].chargingPole;
                                line["desc"]   = data.placemarks[i].name;
                                line["active"] = data.placemarks[i].usedCapacity;   
                                togoArray.push(line)
                           }

                        // send to arcGis Map Layer
                        var cartogoLayer = new esri.layers.GraphicsLayer({
                                visible         : true,
                                id              : 'cartogo',
                        });
 
                        map.addLayers([cartogoLayer]);
                        
                        $jQ.each(togoArray, function(i,cars) {
                           var point = new esri.geometry.Point(cars["lon"],cars["lat"]);
                           if(cars["active"]==1){ 
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/carshare_inactive.png',25, 36);
                           }else{
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/carshare.png',25, 36);
                           }
                           var graphic = new esri.Graphic(point, symbol);
                           cartogoLayer.add(graphic);
                        });

                    },
                    error: function (msg, url, line) {
                        console.log('cartogo input error - error trapped in error: function(msg, url, line)');
                        console.log('cartogo input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
    }

         function getLyft(loc,Scope,loop){  

          // Simulation on basis of an API endpoint for 3rd parties and their agents

           $jQ = jQuery.noConflict();
           $jQ.ajax(
                {
                    type: "GET",
                    url: ('https://www.car2go.com/api/v2.1/vehicles'),
                    data: {
                         loc:loc,
                         oauth_consumer_key: 'car2gowebsite',
                         format: 'json'
                         },
                    contentType: "application/json; charset=utf-8",
                    dataType: "jsonp",
                    success: function (data) {
                        var outData = '';
                        var togoArray = new Array();

                        //parse data into array
                           for (i = 0; i < Object.keys(data.placemarks).length; ++i) { 
                                var line = new Array();
                                line["lon"]    = data.placemarks[i].coordinates[0];
                                line["lat"]    = data.placemarks[i].coordinates[1];
                                togoArray.push(line)
                           }

                        //
                        if(loop){  lyftLayer.graphics=[]; lyftLayer.redraw(); map.setExtent(map.extent); }       // clear map if looped to update

                        // send to arcGis Map Layer
                        lyftLayer = new esri.layers.GraphicsLayer({
                                visible         : true,
                                id              : 'lyft',
                        });

                        //map.addLayers([cartogoLayer]);
                        $jQ.each(togoArray, function(i,cars) {
                         if(loop===undefined){
                           var point = new esri.geometry.Point(cars["lon"],cars["lat"]);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           lyftLayer.add(graphic);
                         }
                        });  //lyftLayer.clear();


                        map.addLayers([lyftLayer]);
                        map.on("click", function () {
                            var graphicsLayer = map.getLayer("lyft");
                            graphicsLayer.clear();
                        });


                    },
                    error: function (msg, url, line) {
                        console.log('cartogo input error - error trapped in error: function(msg, url, line)');
                        console.log('cartogo input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
        
        intId = setInterval(function(){ getLyft(loc,'','looped'); },3000);

    }