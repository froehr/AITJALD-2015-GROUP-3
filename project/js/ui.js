// function for closing the information panel after clicking on close Button
function closeInfoPanel(){
    $("#infoPanel").hide();
    $("#mapPanel").removeClass("col-md-9").addClass("col-md-12");
    map.invalidateSize();
}

// function for opening the information panel after clicking on a map object
function openInfoPanel() {
    $("#infoPanel").show();
    $("#mapPanel").removeClass("col-md-12").addClass("col-md-9");
    map.invalidateSize();
}

// Show a big version of the highcharts plot of the data
function showBigChart(){
    console.log("to be done")
}

$("#closeButton").click(function(){
    closeInfoPanel()
});

$("#map").click(function(){
    openInfoPanel()
});

$("#highchartsData").click(function(){
    showBigChart()
});
