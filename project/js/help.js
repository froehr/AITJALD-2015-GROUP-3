function startIntro(){
    var intro = introJs();

    intro.setOptions({
        exitOnOverlayClick: 'false',
        showStepNumbers: 'false',
        showProgress: true,
        steps: [
            {
                element: "#map",
                intro: "Feel free to browse around the City of Münster and click on each area that you are interested in.",
                position: "auto"
            },
            {
                element: ".leaflet-control-layers",
                intro: "Here, you can choose the background map. You can also see the data for all of Münster, its boroughs, or its districts.",
                position: "auto"
            },            
            {
                element: "#infoPanel",
                intro: "This provides you with the linked data information for each area that you click.",
                position: "auto"
            },
            {
                element: ".dropdown",
                intro: "Choose the information that you want to see in a chart.",
                position: "auto"
            },
            {
                element: "#singleHighchartsData",
                intro: "This diagram will visualize the data read from the database",
                position: "auto"
            }
        ]
    });
    intro.start();
}