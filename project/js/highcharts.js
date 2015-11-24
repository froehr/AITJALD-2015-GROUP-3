// Chart for displaying migration
function callHighcharts(data) {
    $('#highchartsData').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: 'Placeholder'
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Placeholder'
                }
            },

            xAxis: {
                min: 0,
                title: {
                    text: 'Placeholder'
                },
                categories: ["2011", "2012", "2013"]
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
                name: 'Migration',
                data: data,
                color: '#B20047'

            }]
    });
}

callHighcharts([1,2,3]);