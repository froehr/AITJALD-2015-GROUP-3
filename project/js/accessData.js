//@function wktToGeoJSON transforms wkt literals to geojson objects
//@param String wktLiteral: The polygon from the tripple store as WKT-format
//@return returns a geojson object, which can be plotted in Leaflet
function wktToGeoJSON(wktLiteral){
    var completePolygonRegEX = new RegExp("POLYGON.*\\){2}","");
    var completePolygon = wktLiteral.match(completePolygonRegEX);
    var geojson = Terraformer.WKT.parse(completePolygon[0]);
    return geojson;
}

//@function fillInfoPanel reads data from the triplestore and writes it to the info panel
//@param json polygon:
//@return none
function fillInfoPanel(polygon){
    openInfoPanel();
    $("#dataTable > tbody").empty();

    var featureName = polygon.target.feature.properties.name;
    var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + featureName + '> ?description ?feature . }}';

    $.ajax({
        dataType: "jsonp",
        data: {query: query },
        url: QUERYURL,
        complete: function(data) {
            var completeData = data.responseJSON.results.bindings;
            $("#currentArea").text(polygon.target.feature.properties.name.replace("http://vocab.lodcom.de/",""));

            completeData.reverse();
            for (var i = 0; i < completeData.length; i++){
                var data = completeData[i].description.value;
                var dataStrippedRegEX = new RegExp("[\\w\\d\\-]*$","");
                var dataStripped = data.match(dataStrippedRegEX);
                var value = completeData[i].feature.value;

                if (data.search("coverage") == -1){
                    $("#dataTable > tbody:last-child").append("<tr><td><a href=" + data + " target=\"_blank\" title=\"Get further information\">" +
                        dataStripped + "</td><td>" + value + "</td>/tr>");
                }
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

//@function fillChartDropdown reads data from the triplestore and writes it to the dropdown to choose data in chart
//@param json polygon: the leaflet polygon, which was clicked
//@param boolean isSingleDropdown: determines if the single or compare dropdown should be filled.
//@return none
function fillChartDropdown(polygon, isSingleDropdown) {
    if (isSingleDropdown) {
        $('#singleChartDropdown').empty();
        var featureName = polygon.target.feature.properties.name;
        var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + featureName + '> ?description ?feature . }}';
        var valueArray = []
    }
    else {
        $('#multiChartDropdown').empty();
        var featureName = polygon;
        var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + featureName + '> ?description ?feature . }}';
        var valueArray = []
    }

    $.ajax({
        dataType: "jsonp",
        data: {query: query },
        url: QUERYURL,
        complete: function(data) {
            var completeData = data.responseJSON.results.bindings;
            for (var i = 0; i < completeData.length; i++){
                var str = completeData[i].description.value;

                if (str.search("http://vocab.lodcom.de/") != -1) {
                    var dataReGex = new RegExp("([\\w:./]*\\/)([a-zA-Z]*)([\\d\\w_-]*)","");
                    var out = str.replace(dataReGex, "$2");
                    valueArray.push(out);
                }
            }
            valueArray = uniquePolygon(valueArray);

            if (isSingleDropdown) {
                for (var i = 0; i < valueArray.length; i++){
                    var toAppend = '<li id="' + valueArray[i] + '" onclick="loadDataToChart(true, this.id, false)"><div class="lis">' + valueArray[i] + '</div></li>'
                    $("#singleChartDropdown").append(toAppend);
                }
            }
            else {
                for (var i = 0; i < valueArray.length; i++){
                    var toAppend = '<li id="' + valueArray[i] + '" onclick="loadDataToChart(false, this.id, false)"><div class="lis">' + valueArray[i] + '</div></li>'
                    $("#multiChartDropdown").append(toAppend);
                }
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

//@function loadDataToChart reads data from the triplestore and writes it to the chart
//@param json featureName: the polygon's name
//@param string dataName: the datapoints's name like migrationHIstory2010 etc.
//@param boolean add defines if the new series should be added or be the only series in the chart
//@return none
function loadDataToChart(isSingle, dataName){
    if(isSingle) {
        $('#singleHighchartsData').show();
        currentDataPoint = dataName;
        var featureName = currentPolygon.target.feature.properties.name;
        var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + featureName + '> ?dataName ?value ' +
            'FILTER regex(str(?dataName), "' + dataName + '20"). }}';
        getData(query, dataName, false);
    }
    else {
        $('#multiHighchartsData').show();
        currentDataPoint = dataName;
        callHighcharts([], [], "", "Number of Persons", "", "", "", "column", false);
        for (var i = 0; i < comparePolygonArray.length; i++){
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + comparePolygonArray[i] + '> ?dataName ?value ' +
                'FILTER regex(str(?dataName), "' + dataName + '20"). }}';
            getData(query, dataName, true, comparePolygonArray[i]);
        }
    }

    function getData(queryInternal, dataNameInternal, addInternal, featureNameInternal) {
        $.ajax({
            dataType: "jsonp",
            data: {query: queryInternal},
            url: QUERYURL,
            complete: function (data) {
                var completeData = data.responseJSON.results.bindings;
                var contentXAxis = [];
                var contentYAxis = [];
                var chartTitel = dataNameInternal;
                var yAxisMinValue = 0;

                for (var i = 0; i < completeData.length; i++) {
                    contentXAxis.push(completeData[i].dataName.value.replace("http://vocab.lodcom.de/" + dataNameInternal, ""));
                    contentYAxis.push(parseInt(completeData[i].value.value));

                    if (parseInt(completeData[i].value.value) < yAxisMinValue || yAxisMinValue == 0) {
                        yAxisMinValue = parseInt(completeData[i].value.value);
                    }
                }

                contentXAxis.reverse();
                contentYAxis.reverse();

                if (addInternal) {
                    featureNameInternal = featureNameInternal.replace("http://vocab.lodcom.de/", "")
                    addSeries(featureNameInternal, contentYAxis);
                    $('#multiHighchartsData').highcharts().setTitle({text: dataNameInternal});
                    $('#multiHighchartsData').highcharts().xAxis[0].setCategories(contentXAxis);
                }

                else {
                    yAxisMinValue = yAxisMinValue - 200;
                    if (yAxisMinValue < 0) {
                        yAxisMinValue = 0;
                    }
                    callHighcharts(contentXAxis, contentYAxis, "", "Number of Persons", yAxisMinValue, chartTitel, dataNameInternal, "column", true);
                }
            },
            error: function (data) {
                console.log("Error while reading datastore");
            }
        })
    }
}

//@function addJSONToMap adds polygons to a leaflet map with a specified style
//@param json polygon: JSON Object containing the polygon
//@param properties:
//@param string layer: Defines to which to layer the polygon will be added
//@return none
function addJSONToMap(polygon, properties, layer){
    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": properties,
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": polygon.coordinates
        }
    };

    switch (layer){
        case "district":
            district.addData(geojsonFeature);
            break;
        case "borough":
            borough.addData(geojsonFeature);
            break;
        case "city":
            city.addData(geojsonFeature);
            break;
    }
}

//@function queryPolygons reads polygons from tripplestore
//@param String level: The arealevel of the to be created layer (city, borough, district)
//@return returns an array of geojson polygons
function queryPolygons(level){
    var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?area . ' +
        '?area <http://www.opengis.net/ont/geosparql#asWKT> ?polygon . ' +
        '?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "' + level + '", "i") . }}';
    $.ajax({
        dataType: "jsonp",
        data: {query: query},
        url: QUERYURL,
        complete: function(data) {
            var completeData = data.responseJSON.results.bindings;
            for (var i = 0; i < completeData.length; i++){
                var polygon = completeData[i]["polygon"]["value"];
                var property = completeData[i]["name"]["value"];
                addJSONToMap(wktToGeoJSON(polygon), property, level);
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

//@function comparePolygons reads polygons from an array and creates a grafical comparison
//@return none
function comparePolygons(){
    comparePolygonArray = uniquePolygon(comparePolygonArray)
    removeAllSeries();
    fillChartDropdown(comparePolygonArray[0], false)
    $('#compareList').empty();
    loadDataToChart(false, currentDataPoint);

    for(var i = 0; i < comparePolygonArray.length; i++) {
        var id = comparePolygonArray[i].replace("http://vocab.lodcom.de/","");
        $('#compareList').append('<li id="' + id + '"><h4>' + id + ' <button type="button" class="btn btn-danger" ' +
            'onclick="removeFromComparison(\'' + comparePolygonArray[i] + '\')">x</button></h4></li>');
    }
}



function removeFromComparison(featureName) {
    removeSeries(featureName);
    currentHighlightedPolygons = $.grep(currentHighlightedPolygons, function(value) {return value != findElement(layerIDTable, featureName);});
    comparePolygonArray = $.grep(comparePolygonArray, function(value) {return value != featureName;});
    removeSeries(featureName, "multi")
    var featureNameRemove = "#" + featureName.replace("http://vocab.lodcom.de/","");
    $(featureNameRemove).remove();
    for(var i = 0; i < layerIDTable.length; i++) {
        if(layerIDTable[i][0] == featureName) {
            map._layers[layerIDTable[i][1]._leaflet_id].setStyle(NORMALLEAFLETSTYLE);
        }
    }
}

//@function uniquePolygon removes all duplicates from an array
//@param array array is an array, which might have unwanted duplicates in it
//@return none polygon, which is stript from double values
//@source http://stackoverflow.com/a/9229821
function uniquePolygon(array) {
    var seen = {};
    var out = [];
    var len = array.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
        var item = array[i];
        if(seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}
function findElement(array, name) {
    var leafletId = false;
    var notFound = true;
    var i = 0;
    while(i < array.length && notFound) {
        if(name == array[i][0]) {
            leafletId = array[i][1]["_leaflet_id"];
            notFound = false;
        }
        i++;
    }
    return leafletId
}


queryPolygons("district");
queryPolygons("borough");
queryPolygons("city");