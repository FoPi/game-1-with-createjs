/**
 * Created by fopi on 2016.02.28..
 */
function init() {
    var canvasElement = document.querySelector('#demoCanvas');
    canvasElement.setAttribute('width', config.canvas.width);
    canvasElement.setAttribute('height', config.canvas.height);

    var stage = new createjs.Stage("demoCanvas");
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(true);

    var preloader = myContainer.get('preloader');
    preloader.addEventListener('complete', function () {
        addMainView();
    });

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    createjs.Ticker.setFPS(60);

    function generateRandomPosition() {
        return {
            x: Math.ceil(Math.random() * config.canvas.width),
            y: Math.ceil(Math.random() * config.canvas.height)
        };
    }

    setInterval(function () {
        var TitleView = myContainer.get('titleView');
        var circle = new createjs.Graphics();
        circle.setStrokeStyle(1);
        circle.beginStroke("#000000");
        circle.beginFill("red");
        circle.drawCircle(0,0,30);

        var shape = new createjs.Shape(circle);
        var position = generateRandomPosition();
        shape.x = position.x;
        shape.y = position.y;
        TitleView.addChild(shape);
        stage.addChild(TitleView);
        stage.update();
    }, 1000);

    preloadAssets();

    function addMainView () {
        var text = new createjs.Text("Start game", "20px Arial", "#ff7700");
        var textDimensions = text.getBounds();
        text.x = (config.canvas.width / 2) - (textDimensions.width / 2);
        text.y = 100;
        text.textBaseline = "alphabetic";
        text.cursor = 'pointer';

        var TitleView = myContainer.get('titleView');
        var background = new createjs.Bitmap(myContainer.get('preloader').getItem('background').src);

        TitleView.addChild(text);
        stage.addChild(background);
        stage.update();
    }
}

function preloadAssets() {
    var preloader = myContainer.get('preloader');
    preloader.loadFile({id: 'background', src: 'image/bg.jpg'});

    // If sound needed
    //preloader.installPlugin(createjs.Sound);
}