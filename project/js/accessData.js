// Define global SPARQL Endpoint for accessing the data with Ajax
// Using Lodum.uni-muenster to create JSON output
const ENDPOINT = "http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql";
const QUERYURL = "http://jsonp.lodum.de/?endpoint=" + ENDPOINT;
const GRAPH = "http://course.introlinkeddata.org/G3";
const PREFIXES = "@prefix dc: <http://purl.org/dc/elements/1.1/>.";

//@function wktToGeoJSON transforms wkt literals to geojson objects
//@param String wktLiteral: The polygon from the tripple store as WKT-format
//@return returns a geojson object, which can be plotted in Leaflet
function wktToGeoJSON(wktLiteral){
    var completePolygonRegEX = new RegExp("POLYGON.*\\){2}","");
    var completePolygon = wktLiteral.match(completePolygonRegEX);
    var geojson = Terraformer.WKT.parse(completePolygon[0]);
    return geojson;
}

//@function fillInfoPanel reads data from the triplestore and writes it to the infopanel
//@param json leafletResponse: The jsonObject, which is returned by leaflet
//@return returns a geojson object, which can be plotted in Leaflet
function fillInfoPanel(polygon){

    var featureName = polygon.target.feature.properties.name;
    var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ <' + featureName + '> ?description ?feature . }}';

    console.log(query);

    $.ajax({
        dataType: "jsonp",
        data: {query: query },
        url: QUERYURL,
        complete: function(data) {
            console.log(data.responseJSON.results.bindings)
            openInfoPanel();
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

//@function addJSONToMap adds polygons to a leaflet map with a specified style
//@param json polygon: JSON Object containing the polygon
//@param properties:
//@return none
function addJSONToMap(polygon, properties){

    function onEachFeature(feature, layer) {
        layer.on({
            click: polygonOnClick,
            contextmenu: polygonOnRightclick
        });
    }

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

    L.geoJson(geojsonFeature, {
        onEachFeature: onEachFeature
    }).addTo(map);
}

//@function queryPolygons reads polygons from tripplestore
//@param String level: The arealevel of the to be created layer (city, borough, district)
//@return returns an array of geojson polygons
function queryPolygons(level){

    switch (level){
        case "all":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . }}';
            break;
        case "city":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "city", "i") . }}';
            break;
        case "boroughs":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "borough", "i") . }}';
            break;
        case "districts":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "district", "i") . }}';
            break;
        default :
    }

    $.ajax({
        dataType: "jsonp",
        data: {query: query},
        url: QUERYURL,
        complete: function(data) {
            console.log(data.responseJSON);
            console.log(data.responseJSON.results.bindings)
            var completeData = data.responseJSON.results.bindings;
            for (var i = 0; i < completeData.length; i++){
                var polygon = completeData[i]["polygon"]["value"];
                var property = completeData[i]["name"]["value"];
                addJSONToMap(wktToGeoJSON(polygon), property);
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

queryPolygons("districts");


