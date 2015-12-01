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
    resizePanels("map")
    $('#highchartsData').show();
}

// When the windowszie is adjusted the highchart will adjust to the ne available space by rezising
$(window).resize(function() {
    chartResize()
});

// @function chartResize resizes the Highchart according to the available space in the info panel
// @return none
function chartResize(){
    var width = $("#infoPanel").width();
    var height = $(window).height() * 0.5;
    if (height < 300) { height = 300 }
    $('#highchartsData').highcharts().setSize(width, height, Animation=false);
}

function resizePanels(which) {
    if (which === "map") {
        $("#infoPanel").removeClass("col-md-9").addClass("col-md-3");
        $("#mapPanel").removeClass("col-md-3").addClass("col-md-9");
    }

    else if(which === "info") {
        $("#infoPanel").show();
        $("#infoPanel").removeClass("col-md-3").addClass("col-md-9");
        $("#mapPanel").removeClass("col-md-9").addClass("col-md-3");
    }

    else if(which === "mapOnly") {
        $("#infoPanel").hide();
        $("#mapPanel").removeClass("col-md-9").addClass("col-md-12");
        $("#mapPanel").removeClass("col-md-3").addClass("col-md-12");
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