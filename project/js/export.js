$("#startExport").click(function() {
    exportInformation();
});

function exportInformation(callbackExport){
    var level = [];
    var year = [];
    var data = [];
    var geo = []

    var exportObject = {};

    $('#levelExport input:checked').each(function() {level.push($(this).attr('value'));});
    $('#yearsExport input:checked').each(function() {year.push($(this).attr('value'));});
    $('#dataExport input:checked').each(function() {data.push($(this).attr('value'));});
    $('#geoExport input:checked').each(function() {geo.push($(this).attr('value'));});

    var allFilled = true;
    if($.isEmptyObject(level)){allFilled = false};
    if($.isEmptyObject(year)){allFilled = false};
    if($.isEmptyObject(data)){allFilled = false};

    if (!allFilled) {
        $('#messageExport').empty();
        $('#messageExport').html('Please choose at least one value for each category');
        return 0;
    }
    else {
        $('#messageExport').empty();
    }

    level.forEach(function(levelItem) {
        exportObject[levelItem] = {};

        var query = 'SELECT ?feature WHERE {GRAPH <'+GRAPH+'>{ ?feature ?dataName ?value FILTER regex(str(?value), "'
            + levelItem + '")}} GROUP BY ?feature';
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



