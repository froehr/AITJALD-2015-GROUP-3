//This is called, when the user clicks on the "start export" button
$("#startExport").click(function() {
    exportInformation();
});

//@function exportInformation reads the choosen fields from a formular and returns the data according to that as JSON array
function exportInformation(){

    //Initializing of the needed arrays and objects
    var level = [];
    var year = [];
    var data = [];
    var geo = []
    var exportObject = {};

    //Reading the checked fields from the export formular
    $('#levelExport input:checked').each(function() {level.push($(this).attr('value'));});
    $('#yearsExport input:checked').each(function() {year.push($(this).attr('value'));});
    $('#dataExport input:checked').each(function() {data.push($(this).attr('value'));});
    $('#geoExport input:checked').each(function() {geo.push($(this).attr('value'));});

    //Validating if there was checked at least one datapoint in every category
    var allFilled = true;
    if($.isEmptyObject(level)){allFilled = false};
    if($.isEmptyObject(year)){allFilled = false};
    if($.isEmptyObject(data)){allFilled = false};

    if (!allFilled) {
        $('#messageExport').css('color', 'red');
        $('#messageExport').html('Please choose at least one value for each category.');
        return 0;
    }
    else {
        $('#messageExport').css('color', 'green');
        $('#messageExport').html('Success! Please check your browser console to get the data.');
    }

    //Start of reading the data
    level.forEach(function(levelItem) {
        exportObject[levelItem] = {};

        //Building the query for each level, which was choosen levels --> district, borough, city
        var query = 'SELECT ?feature WHERE {GRAPH <'+GRAPH+'>{ ?feature ?dataName ?value FILTER regex(str(?value), "'
            + levelItem + '")}} GROUP BY ?feature';

        //Requesting als areas, which are stored in this level and store it in the output object
        readDataForExport(query, levelItem, "", "", "", "level", function(result) {
            for (var e in result[levelItem]) {
                if(geo[0] == "true") {
                    var geoQuery = 'SELECT ?polygon WHERE {GRAPH <http://course.introlinkeddata.org/G3>{ ' +
                        '?name ?data ?area . ' +
                        '?area <http://www.opengis.net/ont/geosparql#asWKT> ?polygon .' +
                        'FILTER regex(str(?name), "muenster")}}';
                    readDataForExport(geoQuery, levelItem, e, "", "", "geo", "")
                }
                year.forEach(function(yearElement){
                    exportObject[levelItem][e][yearElement] = {};
                    data.forEach(function(dataItem) {
                        var dataQuery = 'SELECT ?dataName ?value WHERE {GRAPH <'+GRAPH+'>{ ?feature ?dataName ?value ' +
                            'FILTER regex(str(?feature), "' + e + '")' +
                            'FILTER regex(str(?dataName), "' + yearElement + '")' +
                            'FILTER regex(str(?dataName), "' + dataItem + '")' +
                            '}}';
                        readDataForExport(dataQuery, levelItem, e, yearElement, dataItem, "data", function (result) {});
                    });
                });
            }
        });
    });


    //@function readDataForExport reads data from the triple store and stores it in an object.
    //@param string query is the query, which is used to choose data from the triple store
    //@param string level is the specified level to choose a position to insert the data into the right position in output level --> district, borough, city
    //@param string levelElement is a specific area like nienberge, buddenturm or any other area stored in the triple store
    //@param int year is the year for which the data is searched and therefor the position to insert it in the outpiut array
    //@param string dataElement the data element to search for. This might be MigrantperHousehold or other
    //@param string caseType defines according to the case what should be done with the result of the ajaxcall
    //@param function callback is used to reuse the read data in the next call to recursivly built the output object
    //@return none
    function readDataForExport(query, level, levelElement, year, dataElement, caseType, callback){
        $.ajax({
            dataType: "jsonp",
            data: {query: query},
            url: QUERYURL,
            complete: function (data) {
                var completeData = data.responseJSON.results.bindings;
                switch (caseType) {
                    case "level":
                        completeData.forEach(function(value){
                            value = value.feature.value.replace("http://vocab.lodcom.de/","");
                            exportObject[level][value] = {};
                        });
                        break;
                    case "geo":
                        exportObject[level][levelElement].geoAsWKT = completeData[0].polygon.value;
                        break;
                    case "data":
                        if(0 in completeData){
                            exportObject[level][levelElement][year][dataElement] = parseInt(completeData[0].value.value);
                        }
                        else {
                            exportObject[level][levelElement][year][dataElement] = "No Data";
                        }
                        break;
                    default:
                        console.log("failure");
                }

                switch (caseType) {
                    case "level":
                        callback(exportObject);
                        break;
                    case "geo":
                        break;
                    case "data":
                        callback(exportObject);
                        break;
                    default:
                        console.log("failure");
                }
            },
            error: function (data) {
                console.log(data);
            }
        })
    }
    console.log("%s %O", "My Object", exportObject);
}