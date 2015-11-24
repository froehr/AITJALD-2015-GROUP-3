// create basic leaflet map with basic functionality
var map = new L.Map('map', {
    center : [51.96, 7.6245],
    zoom : 14,
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

// insert open street map layer into map
var osm_hot = new L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var osm_mq = new L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    subdomains : ['otile1', 'otile2', 'otile3', 'otile4']
});

var osm_mapnik = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var baseMaps = {
    "OSM Hot": osm_hot,
    "OSM MQ": osm_mq,
    "OSM Mapnik": osm_mapnik
};

L.control.layers(baseMaps).addTo(map);


// fit the leaflet map frame into the bootstrap page
var mapmargin = 50;
$('#map').css("height", ($(window).height() - mapmargin) - 40);
$(window).on("resize", resize);
resize();
function resize(){
    if($(window).width()>=980){
        $('#map').css("height", ($(window).height() - mapmargin) - 40);
        //$('#map').css("margin-top",50);
    }else{
        $('#map').css("height", ($(window).height() - (mapmargin+12)) - 230);
        //$('#map').css("margin-top",-21);
    }

    map.invalidateSize();
}