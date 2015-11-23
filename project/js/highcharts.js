// Chart for gender comparison
$(function () {
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
            data: [115, 156, 10],
            color: '#B20047'

        }]
    });
});