// Tableau des outils de dessin disponibles
var setOfDrawingTools = new Array();
// Position précédente de la souris
var previousMousePos;

// Objet Outil dessin au crayon.
setOfDrawingTools.pencil = function () {
    this.mousedown = function (event) {
        paint.started = true;
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
    };

    this.mousemove = function (event) {
        // we delegate the computation of the mouse position
        // to a utility function as this is not so trivial
        var mousePos = getMousePos(paint.getFrontCanvas(), event);

        // On dessine le dessin en fonction de la position de la souris
        if (paint.started) {
            paint.getMainContext().beginPath();
            paint.getMainContext().moveTo(previousMousePos.x, previousMousePos.y);
            paint.getMainContext().lineTo(mousePos.x, mousePos.y);
            paint.getMainContext().stroke();
        }
        previousMousePos = mousePos;
    };

    this.mouseup = function (event) {
        paint.started = false;
    }
};

// Outil dessin au trait
setOfDrawingTools.line = function () {
    this.mousedown = function (event) {
        paint.started = true;
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
    };


    this.mousemove = function (event) {
        var mousePos = getMousePos(paint.getFrontCanvas(), event);
        if (paint.started) {
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            paint.getFrontContext().beginPath();
            paint.getFrontContext().moveTo(previousMousePos.x, previousMousePos.y);
            paint.getFrontContext().lineTo(mousePos.x, mousePos.y);
            paint.getFrontContext().stroke();
        }
    };

    this.mouseup = function (event) {
        paint.started = false;
        paint.drawFrontCanvasOnMainCanvas();
    }
};

// Outil dessin au rectangle
setOfDrawingTools.rectangle = function() {
    var mousePos, x, y, width, height;

    this.mousedown = function (event) {
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
        paint.started = true;
    }

    this.mousemove = function (event) {
        mousePos = getMousePos(paint.getFrontCanvas(), event);
        // Utiliser les outils 
        if (paint.started) {
            // clear the content of the canvas
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            width = Math.abs(previousMousePos.x - mousePos.x);
            height = Math.abs(previousMousePos.y - mousePos.y);
            x = Math.min(previousMousePos.x, mousePos.x);
            y = Math.min(previousMousePos.y, mousePos.y);
            if(paint.getFillShapesStatus()) {
                paint.getFrontContext().fillRect(x, y, width, height);
            }
            paint.getFrontContext().strokeRect(x, y, width, height);
        }
    }

    this.mouseup = function (event) {
        paint.drawFrontCanvasOnMainCanvas();
        paint.started = false;
    }
};

// Outil dessin du cercle
setOfDrawingTools.circle = function() {
    var mousePos, x, y, radius;

    this.mousedown = function (event) {
        previousMousePos = getMousePos(paint.getFrontCanvas(), event);
        paint.started = true;
    }

    this.mousemove = function (event) {
        mousePos = getMousePos(paint.getFrontCanvas(), event);
        // Draw only if we clicked somewhere
        if (paint.started) {
            // clear the content of the canvas
            paint.getFrontContext().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);

            // center of the circle is the position that has been clicked
            x = previousMousePos.x;
            y = previousMousePos.y;
            // radius is the distance between the clicked position (center) and current position
            radius = Math.sqrt(Math.pow(previousMousePos.x - mousePos.x, 2) + Math.pow(previousMousePos.y - mousePos.y, 2));
            paint.getFrontContext().beginPath();
            paint.getFrontContext().arc(x, y, radius, 0, 2 * Math.PI, false);

            if(paint.getFillShapesStatus()) {
                paint.getFrontContext().fill();
            }
            paint.getFrontContext().stroke();
        }
    }

    this.mouseup = function (event) {
        paint.drawFrontCanvasOnMainCanvas();
        paint.started = false;
    }
};




