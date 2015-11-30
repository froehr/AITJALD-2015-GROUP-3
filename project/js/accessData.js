// Define global SPARQL Endpoint for accessing the data with Ajax
// Using Lodum.uni-muenster to create JSON output
const ENDPOINT = "http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql";
const QUERYURL = "http://jsonp.lodum.de/?endpoint=" + ENDPOINT;

//@function wktToGeoJSON transforms wkt literals to geojson objects
//@param String wktLiteral: The polygon from the tripple store as WKT-format
//@return returns a geojson object, which can be plotted in Leaflet
function wktToGeoJSON(wktLiteral){
    var completePolygonRegEX = new RegExp("POLYGON.*\\){2}","");
    var completePolygon = wktLiteral.match(completePolygonRegEX);
    var geojson = Terraformer.WKT.parse(completePolygon[0]);
    console.log(geojson)
    return geojson;
}

//@function addJSONToMap adds polygons to a leaflet map with a specified style
//@param string color: Color in hexcode
//@param float weight: Weight of the Layer
//@param float opacity: Opacity from 0.0 to 1.0
//@param json geoJSON: JSON Object containing the polygon
//@return none
function addJSONToMap(color, weight , opacity, polygon, properties){
    var mapStyle = {
        "color": color,
        "weight": weight,
        "opacity": opacity
    };

    L.geoJson(polygon, {
        style: mapStyle
    }).addTo(map);
}

//@function queryPolygons reads polygons from tripplestore
//@param String level: The arealevel of the to be created layer (city, borough, subarea, district)
//@return returns an array of geojson polygons
function queryPolygons(level){
    $.ajax({
        dataType: "jsonp",
        data: {query: "SELECT DISTINCT * WHERE { ?a ?b ?c . }"},
        url: QUERYURL,
        complete: function(data) {
            console.log(data.responseJSON);
            console.log(data.responseJSON.results.bindings.length);
            test = data.responseJSON.results.bindings["19"]["c"]["value"];

            addJSONToMap("red", 1, 1, wktToGeoJSON(test));

        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

queryPolygons("test");


