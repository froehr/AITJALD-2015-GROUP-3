//@function callHighcharts renders the data from the triple store to a chart using highcharts
//@param array xAxis is an array, which stores the labels for the xAxis as string, int or float
//@param array yAxis is an array, which stores the values for the xAxis as int or float
//@param string xAxisTitel
//@param string yAxisTitel
//@param string chartTitel
//@param string seriesName
//@param string chartType
//@info xAxis.length() and yAxis.length must be equal
//@return none
function callHighcharts(xAxis, yAxis, xAxisTitel, yAxisTitel, chartTitel, seriesName, charType) {
    console.log("finish documentation!")
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
                min: 0,
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
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },

            series: [{
                name: seriesName,
                data: yAxis,
                color: '#B20047'

            }]
    });
}

callHighcharts([],[], "", "", "", "");