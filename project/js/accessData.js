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

            for (var i = 0; i < completeData.length; i++){
                var data = completeData[i].description.value;
                var dataStrippedRegEX = new RegExp("[\\w\\d]*$","");
                var dataStripped = data.match(dataStrippedRegEX);
                var value = completeData[i].feature.value;

                if (data.search("coverage") == -1){
                    $("#dataTable > tbody:last-child").append("<tr><td><a href=" + data + ">" +
                        dataStripped + "</td><td>" + value + "</td>/tr>");
                }
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
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
        case "muenster_all":
            muenster_all.addData(geojsonFeature);
            break;
        case "muenster_districts":
            muenster_districts.addData(geojsonFeature);
            break;
        case "muenster_boroughs":
            muenster_boroughs.addData(geojsonFeature);
            break;
        case "muenster_city":
            muenster_city.addData(geojsonFeature);
            break;
        default:
    }
}

//@function queryPolygons reads polygons from tripplestore
//@param String level: The arealevel of the to be created layer (city, borough, district)
//@return returns an array of geojson polygons
function queryPolygons(level){

    switch (level){
        case "all":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . }}';
            var layer = "muenster_all";
            break;
        case "city":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "city", "i") . }}';
            var layer = "muenster_city";
            break;
        case "borough":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "borough", "i") . }}';
            var layer = "muenster_boroughs";
            break;
        case "district":
            var query = 'SELECT * WHERE {GRAPH <'+GRAPH+'>{ ?name <http://purl.org/dc/elements/1.1/coverage> ?polygon . ?name <http://purl.org/dc/elements/1.1/description> ?b FILTER regex(?b, "district", "i") . }}';
            var layer = "muenster_districts";
            break;
        default :
    }

    $.ajax({
        dataType: "jsonp",
        data: {query: query},
        url: QUERYURL,
        complete: function(data) {
            var completeData = data.responseJSON.results.bindings;
            for (var i = 0; i < completeData.length; i++){
                var polygon = completeData[i]["polygon"]["value"];
                var property = completeData[i]["name"]["value"];
                addJSONToMap(wktToGeoJSON(polygon), property, layer);
            }
        },
        error: function(data){
            console.log("Error while reading datastore");
        }
    })
}

queryPolygons("borough");
queryPolygons("district");
queryPolygons("city");
queryPolygons("all");

