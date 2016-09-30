/**
 * Created by fopi on 2016.02.28..
 */
function init() {
    var canvasElement = document.querySelector('#demoCanvas');
    canvasElement.setAttribute('width', config.canvas.width);
    canvasElement.setAttribute('height', config.canvas.height);

    var stage = new createjs.Stage("demoCanvas");
    myContainer.set('demoCanvas', stage);
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(true);

    var preloader = myContainer.get('preloader');
    preloader.addEventListener('complete', function () {
        var keys = {};
        myContainer.set('keys', keys);
        handleKeyEvents();
        addMainView();
        setInterval(createTarget, 1000);
    });

    createjs.Ticker.setFPS(60);

    function generateRandomPosition() {
        return {
            x: Math.ceil(Math.random() * config.canvas.width),
            y: Math.ceil(Math.random() * config.canvas.height)
        };
    }

    myContainer.set('targets', new createjs.Container());

    function createTarget() {
        var targetsContainer = myContainer.get('targets');
        var circle = new createjs.Graphics();
        circle.setStrokeStyle(1);
        circle.beginStroke("#000000");
        circle.beginFill("red");
        circle.drawCircle(0, 0, 30);

        var shape = new createjs.Shape(circle);
        var position = generateRandomPosition();
        shape.x = position.x;
        shape.y = position.y;
        targetsContainer.addChild(shape);
        stage.addChild(targetsContainer);
        stage.update();
    }

    preloadAssets();

    function addMainView () {
        var text = new createjs.Text("Start game", "20px Arial", "#ff7700");
        var textDimensions = text.getBounds();
        text.x = (config.canvas.width / 2) - (textDimensions.width / 2);
        text.y = 100;
        text.textBaseline = "alphabetic";
        text.cursor = 'pointer';

        var menu = new createjs.Container();
        myContainer.set('menu', menu);
        menu.addChild(text);
        stage.addChild(menu);

        var background = new createjs.Bitmap(myContainer.get('preloader').getItem('background').src);
        stage.addChild(background);

        addPlayer(stage);

        stage.update();
    }
}

function preloadAssets() {
    var preloader = myContainer.get('preloader');
    preloader.loadFile({id: 'background', src: 'image/bg.jpg'});

    // If sound needed
    //preloader.installPlugin(createjs.Sound);
}

function handleKeyEvents() {
    var keys = myContainer.get('keys');
    var upDirection = [87, 38];
    var downDirection = [83, 40];
    var leftDirection = [65, 37];
    var rightDirection = [68, 39];
    var shootKey = [17, 32];

    document.addEventListener('keydown', function (event) {
        if (upDirection.indexOf(event.keyCode) !== -1) {
            keys['up'] = true;
        }

        if (leftDirection.indexOf(event.keyCode) !== -1) {
            keys['left'] = true;
        }

        if (rightDirection.indexOf(event.keyCode) !== -1) {
            keys['right'] = true;
        }

        if (downDirection.indexOf(event.keyCode) !== -1) {
            keys['down'] = true;
        }

        if (shootKey.indexOf(event.keyCode) !== -1 && !keys['shoot']) {
            keys['shoot'] = true;
            handleShootAction();
        }
    });

    document.addEventListener('keyup', function (event) {
        if (upDirection.indexOf(event.keyCode) !== -1) {
            delete keys['up'];
        }

        if (leftDirection.indexOf(event.keyCode) !== -1) {
            delete keys['left'];
        }

        if (rightDirection.indexOf(event.keyCode) !== -1) {
            delete keys['right'];
        }

        if (downDirection.indexOf(event.keyCode) !== -1) {
            delete keys['down'];
        }

        if (shootKey.indexOf(event.keyCode) !== -1) {
            delete keys['shoot'];
        }
    });
}

function hasCirclesIntersection(circle1, circle2) {
    var distanceX;
    var distanceY;
    var distance;

    distanceX = circle1.x - circle2.x;
    distanceY = circle1.y - circle2.y;

    distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

    return distance <= (circle1.radius + circle2.radius);
}

function handleShootAction() {
    var keys = myContainer.get('keys');

    if (!keys || !keys['shoot']) {
        return;
    }

    var targetsContainer = myContainer.get('targets');
    var player = myContainer.get('player');
    var stage = myContainer.get('demoCanvas');


    for (var index in targetsContainer.children) {
        if (Object.prototype.hasOwnProperty.call(targetsContainer.children, index)) {
            var child = targetsContainer.children[index];
            var playerCircle = {
                x: player.x,
                y: player.y,
                radius: player.graphics.command.radius
            };
            var childCircle = {
                x: child.x,
                y: child.y,
                radius: child.graphics.command.radius
            };

            if (hasCirclesIntersection(playerCircle, childCircle)) {
                stage.update();
            }
        }
    }
}

function addPlayer(stage) {
    var playerRadius = 50;
    var player = new createjs.Shape();
    player.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, playerRadius);
    player.x = 100;
    player.y = 100;

    myContainer.set('player', player);

    function movePlayer() {
        var keys = myContainer.get('keys');
        var moveX = 0;
        var moveY = 0;

        if (keys['up']) {
            moveY = -10;
        }

        if (keys['down']) {
            moveY = 10;
        }

        if (keys['left']) {
            moveX = -10;
        }

        if (keys['right']) {
            moveX = 10;
        }

        if (moveX) {
            if (moveX > 0) {
                if ((player.x + moveX + playerRadius) < config.canvas.width) {
                    player.x += moveX;
                } else {
                    player.x = config.canvas.width - playerRadius;
                }
            }

            if (moveX < 0) {
                if ((player.x + moveX - playerRadius) > 0) {
                    player.x += moveX;
                } else {
                    player.x = playerRadius;
                }
            }
        }

        if (moveY) {
            if (moveY > 0) {
                if ((player.y + moveY + playerRadius) < config.canvas.height) {
                    player.y += moveY;
                } else {
                    player.y = config.canvas.height - playerRadius;
                }
            }

            if (moveY < 0) {
                if ((player.y +moveY - playerRadius) > 0) {
                    player.y += moveY;
                } else {
                    player.y = playerRadius;
                }
            }
        }

        stage.update();
    }

    createjs.Ticker.addEventListener('tick', movePlayer);
    stage.addChild(player);
}