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
function callHighcharts(xAxis, yAxis, xAxisTitel, yAxisTitel, yAxisMinValue, chartTitel, seriesName, charType) {
    $('#highchartsData').highcharts({
            chart: {
                type: charType,
                events: {
                    click: function(e) {
                    }
                }
            },
            title: {
                text: chartTitel
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
                data: yAxis,
                color: '#B20047'
            }]
    });
}
callHighcharts([],[], "", "", "", "");