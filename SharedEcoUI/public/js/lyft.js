     function getLyft(loc,Scope){  

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

                        // send to arcGis Map Layer
                        var cartogoLayer = new esri.layers.GraphicsLayer({
                                visible         : true,
                                id              : 'cartogo',
                        });
 
                        map.addLayers([cartogoLayer]);
                        
                        $jQ.each(togoArray, function(i,cars) {
                          if(i<50){ 
                           var point = new esri.geometry.Point(cars["lon"],cars["lat"]);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           cartogoLayer.add(graphic);
                          }
                        });

                    },
                    error: function (msg, url, line) {
                        console.log('cartogo input error - error trapped in error: function(msg, url, line)');
                        console.log('cartogo input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
    }