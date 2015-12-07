function startIntro(){
    var intro = introJs();

    intro.setOptions({
        steps: [
            {
                element: "#map",
                intro: "This will be the first help step",
                position: "right"
            },
            {
                element: "#infoPanel",
                intro: "This will be the second help step",
                position: "left"
            }
        ]
    });
    intro.start();
}