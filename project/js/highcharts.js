//@function callHighcharts renders the data from the triple store to a chart using highcharts
//@param array xAxis is an array, which stores the labels for the xAxis as string, int or float
//@param array yAxis is an array, which stores the values for the xAxis as int or float
//@param string xAxisTitel is the title of the x axis
//@param string yAxisTitel is the title of the y axis
//@param int yAxisMinValue is an offset for the y axis so that the axis is adjusted to the data
//@param string chartTitel is the title for the complete chart
//@param string seriesName is the name of the data series itself
//@param string chartType makes it possible to set the chart type like bar, line, column etc.
//@info xAxis.length() and yAxis.length must be equal
//@return none
function callHighcharts(xAxis, yAxis, xAxisTitel, yAxisTitel, yAxisMinValue, chartTitel, seriesName, chartType, single) {
    switch (single) {
        case true:
            $('#singleHighchartsData').highcharts({
                chart: {
                    type: chartType,
                    zoomType: 'xy',
                    events: {
                        click: function(e) {
                        }
                    }
                },
                title: {
                    text: chartTitel,
                    style: {
                        fontSize: '1.5vmin',
                        fontWeight: 'bold',
                        color: '#1381bc',
                        lineHeight: '15em',
                    }
                },
                yAxis: {
                    min: yAxisMinValue,
                    title: {
                        text: yAxisTitel
                    }
                },
                xAxis: {
                    min: 0,
                    title: {
                        text: xAxisTitel
                    },
                    categories: xAxis
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    headerFormat: '<b>{point.key}</b><table>',
                    pointFormat: '<tr><td style="color: {series.color}">{series.name}:</td></tr>' +
                    '<tr><td><b>{point.y} persons</b></td></tr>',
                    footerFormat: '</table>',
                },
                series: [{
                    name: seriesName,
                    id: seriesName,
                    data: yAxis
                }]
            });
            break;
        case false:
            $('#multiHighchartsData').highcharts({
                chart: {
                    type: chartType,
                    zoomType: 'xy',
                    events: {
                        click: function(e) {
                        }
                    }
                },
                title: {
                    text: chartTitel,
                    style: {
                        fontSize: '1.5vmin',
                        fontWeight: 'bold',
                        color: '#1381bc',
                        lineHeight: '15em',
                    }
                },
                yAxis: {
                    min: yAxisMinValue,
                    title: {
                        text: yAxisTitel
                    }
                },
                xAxis: {
                    min: 0,
                    title: {
                        text: xAxisTitel
                    },
                    categories: xAxis
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    headerFormat: '<b>{point.key}</b><table>',
                    pointFormat: '<tr><td style="color: {series.color}">{series.name}:</td></tr>' +
                    '<tr><td><b>{point.y} persons</b></td></tr>',
                    footerFormat: '</table>',
                }
            });
            break;
    }

}
callHighcharts([],[], "", "", "", "","","", true);
callHighcharts([],[], "", "", "", "","","", false);

//@function removeSeries removes a specific series from the chart
//@param string seriesID is the name of a series and therefor a district, borough or city
//@return none
function removeSeries(seriesID, chart) {
    seriesID = seriesID.replace("http://vocab.lodcom.de/","");
    switch (chart){
        case "single":
            $('#singleHighchartsData').highcharts().get(seriesID).remove();
            break;
        case "multi":
            $('#multiHighchartsData').highcharts().get(seriesID).remove();
    }

}

//@function addSeries adds a new series to the chart
//@param string seriesName is the name of a series and also the id of the series - this will always be the name of the district or borough
//@param array seriesDara stores the data, which will be shown in the graph
//@return none
function addSeries(seriesName, seriesData){
    $('#multiHighchartsData').highcharts().addSeries({
        data: seriesData,
        name: seriesName,
        id: seriesName
    });
}

//@function removeAllSeries removes all series from the graph to make it possible to make a  new comparison
//@return none
function removeAllSeries(){
    while( $('#singleHighchartsData').highcharts().series.length > 0) {
        $('#singleHighchartsData').highcharts().series[0].remove(true);
    }
}