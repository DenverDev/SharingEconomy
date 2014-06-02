     function getCarToGo(loc,Scope){  
           var that = this;
           //$jQ = jQuery.noConflict();
           $.ajax(
                {
                    type: "GET",
                    url: ('https://www.car2go.com/api/v2.1/parkingspots'),
                    data: {
                       loc:loc,
                         oauth_consumer_key: 'SharedEcoTransport',
                         format: 'json'
                         },
                    contentType: "application/json; charset=utf-8",
                    dataType: "jsonp",
                    success: function(data) {
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
                        cartogoLayer = new esri.layers.GraphicsLayer({
                                visible         : true,
                                id              : 'cartogo',
                        });
 
                        map.addLayers([cartogoLayer]);
                        
                        $.each(togoArray, function(i,cars) {
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

           //$jQ = jQuery.noConflict();
           $.ajax(
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
                         lyftLayer = map.getLayer('lyft');
                           if(lyftLayer){ 
                            lyftLayer.clear(); 
                           }else{
                            lyftLayer = new esri.layers.GraphicsLayer({
                                visible         : true,
                                id              : 'lyft',
                            });
                          }
                                 
                        //map.addLayers([cartogoLayer]);
                        $.each(togoArray, function(i,cars) {
                         if(loop===undefined && i<35){
                           var point = new esri.geometry.Point(cars["lon"],cars["lat"]);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           lyftLayer.add(graphic);
                         }else if(i>10 && i<50 && loop==1){
                           var point = new esri.geometry.Point(cars["lon"]+0.008,cars["lat"]+0.011);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           lyftLayer.add(graphic);
                         }else if(i>15 && i<60 && loop==2){
                           var point = new esri.geometry.Point(cars["lon"]+0.016,cars["lat"]+0.019);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           lyftLayer.add(graphic);
                         }else if(i>25 && i<65){
                           var point = new esri.geometry.Point(cars["lon"]+0.024,cars["lat"]+0.029);
                           var symbol = new esri.symbol.PictureMarkerSymbol('./public/Images/lyft.png',25, 36);
                           var graphic = new esri.Graphic(point, symbol);
                           lyftLayer.add(graphic);
                         }

                        });

                     map.addLayers([lyftLayer]);

                    },
                    error: function (msg, url, line) {
                        console.log('cartogo input error - error trapped in error: function(msg, url, line)');
                        console.log('cartogo input error - msg = ' + msg + ', url = ' + url + ', line = ' + line);
                    }
                });
        
        delete lyftLayer;
          var numOfCalls = 0;
         if(loop===undefined){ 
          var intervalID = setInterval(function(){ 
            getLyft(loc,'',numOfCalls); 
            numOfCalls++;
              if(numOfCalls == 5){ window.clearInterval(intervalID); }
          },2000);
         }
  
    }
