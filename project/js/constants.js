// Define global SPARQL Endpoint for accessing the data with Ajax
// Using Lodum.uni-muenster to create JSON output
const ENDPOINT = "http://giv-lodumdata.uni-muenster.de:8282/parliament/sparql";
const QUERYURL = "http://jsonp.lodum.de/?endpoint=" + ENDPOINT;
const GRAPH = "http://course.introlinkeddata.org/G3";
const PREFIXES = ["@prefix dc: <http://purl.org/dc/elements/1.1/>."];

// Id of contextmenu
const CONTEXTID = "#contextMenu";

// Style for highlighted features in leaflet
const HIGHLIGHTEDLEAFLETSTYLE = {
    'color': 'red',
    'weight': 2,
    'opacity': 1
};

// Style for normal styled features in leaflet
const NORMALLEAFLETSTYLE = {
    'color': 'green',
    'weight': 2,
    'opacity': 1
}

// Margin around mapframe in px
const MAPMARGIN = 50;

// Current or last polygon choosen in contextmenu;
var currentPolygon;

// Array which stores all elements which should be compared
var comparePolygonArray = [];

// The polygon, which is currently highlighted
var currentHighlightedPolygons = [];

// The current Datapoint, which is shown in the chart, this is choosen by the dropdown above the chart
var currentDataPoint = "HouseholdwithMajorityPopulationMigrationHistory";

// Stores all Layer IDs with corresponding name
var layerIDTable = []