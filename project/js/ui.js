// @function closeInfoPanel closes the information panel after clicking on close Button
// @return none
function closeInfoPanel() {
    resizePanels("mapOnly");
    map.invalidateSize();
}

// @function openInfoPanel opens the information panel after clicking on a specific polygon on the map
// @return none
function openInfoPanel() {
    resizePanels("info");
    showSmallChart();
    hideExportFunction();
    $("#bigChartButton").show();
    $("#smallChartButton").hide()
    $("#exportButton").show()
    $("#exportCloseButton").hide()
    map.invalidateSize();
}

// @function showBigChart creates more space for the information panel after clicking on a specific button
// @return none
function showBigChart() {
    $("#infoPanel").show();
    resizePanels("info");
    chartResize();
}

// @function showSmallChart makes the chart smaller when clicking a specific button
// @return none
function showSmallChart() {
    $("#infoPanel").show();
    resizePanels("map");
    chartResize();
}

function showExportFunction() {
    resizePanels("info");
    $('#highchartsData').hide();
}

function hideExportFunction() {
    resizePanels("map");
    chartResize();
    $('#highchartsData').show();
}

// When the windowszie is adjusted the highchart will adjust to the ne available space by rezising
$(window).resize(function() {
    chartResize();
});

// When the windowszie is adjusted the maximum height of the info panel is adjusted
function reziseInfoPanel(){
    $('#infoPanel').css('max-height', $('#mapPanel').height());
}

// @function chartResize resizes the Highchart according to the available space in the info panel
// @return none
function chartResize(){
    var width = $("#infoPanel").width();
    var height = $(window).height() * 0.5;
    if (height < 300) { height = 300 }
    $('#highchartsData').highcharts().setSize(width, height, Animation=false);
}

// @function resizePanels resizes the map and info panel according to the users choice
// @return none
function resizePanels(which) {
    if (which === "map") {
        $("#infoPanel").removeClass("col-md-8").addClass("col-md-4");
        $("#mapPanel").removeClass("col-md-4").addClass("col-md-8");
    }

    else if(which === "info") {
        $("#infoPanel").show();
        $("#infoPanel").removeClass("col-md-4").addClass("col-md-8");
        $("#mapPanel").removeClass("col-md-8").addClass("col-md-4");
    }

    else if(which === "mapOnly") {
        $("#infoPanel").hide();
        $("#mapPanel").removeClass("col-md-4 col-md-8").addClass("col-md-12");
    }
}

$("#closeButton").click(function(){
    closeInfoPanel();
});

$("#bigChartButton").click(function(){
    $("#bigChartButton").hide();
    $("#smallChartButton").show()
    showBigChart();
});

$("#smallChartButton").click(function(){
    $("#bigChartButton").show();
    $("#smallChartButton").hide()
    showSmallChart();
});

$("#exportButton").click(function(){
    $("#bigChartButton").hide();
    $("#smallChartButton").hide()
    $("#exportButton").hide()
    $("#exportCloseButton").show()
    showExportFunction();
});

$("#exportCloseButton").click(function(){
    $("#bigChartButton").show();
    $("#smallChartButton").hide()
    $("#exportButton").show()
    $("#exportCloseButton").hide()
    hideExportFunction();
});

$("#contextMenu").children().click(function(event){
    var id = event.target.id;
    switch(id){
        case "compareContext":
            comparePolygonArray.push(currentPolygon.target.feature.properties.name);
            highlightLayer(currentPolygon.target._leaflet_id, "highlightedStyle");
            comparePolygons();
            break;
        case "zoomToFeatureContext":
            zoomToFeature(currentPolygon);
            break;
        case "zoomToLayerContext":
            zoomToLayer();
            break;
        default :
    }
});

//make sure contextmenu closes on any click
$(document).click(function () {
    hideContextmenu();
});

// fit the leaflet map frame into the bootstrap page
$(window).on("resize", resizeMap);

// set the maximum hight of the info panel so that it no has no overflow
$(window).on("resize", reziseInfoPanel);

// initial reszing of map and info panel
resizeMap();
reziseInfoPanel();