// create basic leaflet map with basic functionality
var map = new L.Map('map', {
    center : [51.96, 7.6245],
    zoom : 11,
    dragging : true,
    touchZoom : true,
    scrollWheelZoom : true,
    doubleClickZoom : true,
    boxZoom : true,
    tap : true,
    tapTolerance : 15,
    trackResize : true,
    worldCopyJump : false,
    closePopupOnClick : true,
    scale : true
});

// Scalebar
var Lscalebar = new L.control.scale({
    position : 'bottomright',
    metric : true,
    imperial : false
}).addTo(map)

// insert open street map layer into map
var osm_hot = new L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// insert open street map layer into map
var osm_mq = new L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    subdomains : ['otile1', 'otile2', 'otile3', 'otile4']
});

// insert open street map layer into map
var osm_mapnik = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

// create geoJSON layers for the different area levels (district, borough, city)
var district = L.geoJson([],{onEachFeature: onEachFeature, "style": NORMALLEAFLETSTYLE});
var borough = L.geoJson([],{onEachFeature: onEachFeature, "style": NORMALLEAFLETSTYLE});
var city = L.geoJson([],{onEachFeature: onEachFeature, "style": NORMALLEAFLETSTYLE});

district.addTo(map);

// Create basemap switch
var baseMaps = {
    "OSM Hot": osm_hot,
    "OSM MQ": osm_mq,
    "OSM Mapnik": osm_mapnik
};

var polygonLayers = {
    "district": district,
    "borough": borough,
    "city": city
};

function onEachFeature(feature, layer) {
    layer.on({
        click: polygonOnClick,
        contextmenu: polygonOnRightclick,
    });
}

// Layer switcher
var LlayerSwitcher = new L.control.layers(baseMaps, polygonLayers, {
    position : 'topright'
}).addTo(map);

//@function resize keeps the leaflet map in the frame provided by bootstrap
//@return none
function resizeMap(){
    if($(window).width() >= 980){$('#map').css("height", ($(window).height() - MAPMARGIN) - 40)}
    else{$('#map').css("height", ($(window).height() - (MAPMARGIN + 12)) - 230)}
    map.invalidateSize();
}

//@function polygonOnClick is triggered, when a polygon is clicked with the left mouse button
//@param object e: Leafletobject with data about click position
//@return none
function polygonOnClick(e) {
    $('#highchartsData').hide();
    comparePolygonArray = [];
    comparePolygonArray.push(e.target.feature.properties.name);
    highlightLayer(e.target._leaflet_id, "normaleStyle");
    fillInfoPanel(e);
    fillChartDropdown(e);
    hideContextmenu();
}

//@function polygonOnRightclick is triggered, when a polygon is clicked with the right mouse button
//@param object e: Leafletobject with data about click position
//@return none
function polygonOnRightclick(e) {
    openContextmenu(e);
}

//@function openContextmenu is called after a rightclick on a polygon. It offers a contextmenu with several additional tasks
//@param object e: Leafletobject with data about click position
//@return none
function openContextmenu(e) {
    var top = e.originalEvent.clientY;
    var left =  e.originalEvent.clientX;
    var contextHight = $("#contextMenu").height();
    var contextWidth = $("#contextMenu").width();
    var mapHight = $("#map").height();
    var mapWidth = $("#map").width();
    var contextPositionY;
    var contextPositionX;

    currentPolygon = e;

    if(top + contextHight - 20 < mapHight) {contextPositionY = top}
    else {contextPositionY = top - contextHight}

    if(left + contextWidth - 20 < mapWidth) {contextPositionX = left}
    else {contextPositionX = left - contextWidth}

    $(CONTEXTID).show()
    $(CONTEXTID).css("position", "absolute");
    $(CONTEXTID).css("top", contextPositionY);
    $(CONTEXTID).css("left", contextPositionX);
}

//@function zoomToFeature zoom to a specific feature
//@param object e: Leafletobject with data about click position
function zoomToFeature(e) {
    var layer = e.target;
    map.fitBounds(layer.getBounds());
}

//@function zoomToLayer zoom to the extend of the layer of the clicked polygon
//@param object e: Leafletobject with data about click position
function zoomToLayer() {
    map.fitBounds(muenster_city.getBounds());
}

function hideContextmenu(){
    $(CONTEXTID).hide()
}

//@function highlightLayer highlights currently selected layers
//@param int layerID: a specified leaflet LayerID
//@param string type: defines if its a comparison or a new set of highlighted features
function highlightLayer(layerID, type) {
    switch (type){
        case "normaleStyle":
            for (var i = 0; i < currentHighlightedPolygons.length; i++){
                map._layers[currentHighlightedPolygons[i]].setStyle(NORMALLEAFLETSTYLE);
            }
            currentHighlightedPolygons = [];
            map._layers[layerID].setStyle(HIGHLIGHTEDLEAFLETSTYLE);
            map._layers[layerID].bringToFront();
            currentHighlightedPolygons.push(layerID);
            break;
        case "highlightedStyle":
            currentHighlightedPolygons.push(layerID);
            for (var i = 0; i < currentHighlightedPolygons.length; i++){
                map._layers[currentHighlightedPolygons[i]].setStyle(HIGHLIGHTEDLEAFLETSTYLE);
                map._layers[layerID].bringToFront();
            }
            break;
        default:
    }
}