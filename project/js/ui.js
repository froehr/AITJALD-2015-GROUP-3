// @function closeInfoPanel closes the information panel after clicking on close Button
// @return none
function closeInfoPanel(){
    $("#infoPanel").hide();
    $("#mapPanel").removeClass("col-md-9").addClass("col-md-12");
    map.invalidateSize();
}

// @function openInfoPanel opens the information panel after clicking on a specific polygon on the map
// @return none
function openInfoPanel() {
    $("#infoPanel").show();
    $("#mapPanel").removeClass("col-md-12").addClass("col-md-9");
    map.invalidateSize();
}

// @function showBigChart creates more space for the information panel after clicking on the highchart
// @return none
function showBigChart(){
    $("#infoPanel").show();
    $("#infoPanel").removeClass("col-md-3").addClass("col-md-9");
    $("#mapPanel").removeClass("col-md-12").addClass("col-md-3");

    console.log("This function has to be adjusted")
}

$("#closeButton").click(function(){
    closeInfoPanel()
});

$("#highchartsData").click(function(){
    showBigChart()
});
