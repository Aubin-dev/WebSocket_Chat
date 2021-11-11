
var paint;
// Par defaut, on dessine avec le crayon
var DEFAULT_TOOL = 'pencil';

// Fonction de gestion du canva principal
function PaintObject(maincvs) {

    this.started = false;

    // get handle of the main canvas, as a DOM object, not as a jQuery Object. Context is unfortunately not yet
    // available in jquery canvas wrapper object.
    var mainCanvas = $("#" + maincvs).get(0);

    if (!mainCanvas) {alert("canvas undefined, does not seem to be supported by your browser");}
    if (!mainCanvas.getContext) {alert('Error: canvas.getContext() undefined !');}

    var mainContext = mainCanvas.getContext('2d');
    if (!mainContext) {alert("could not get the context for the main canvas");}

    this.getMainCanvas = function () {
        return mainCanvas;
    }
    this.getMainContext = function () {
        return mainContext;
    }

    // Prepare a second canvas on top of the previous one, kind of second "layer" that we will use
    // in order to draw elastic objects like a line, a rectangle or an ellipse we adjust using the mouse
    // and that follows mouse movements
    var frontCanvas = document.createElement('canvas');
    frontCanvas.id = 'canvasFront';
    // Add the temporary canvas as a second child of the mainCanvas parent.
    mainCanvas.parentNode.appendChild(frontCanvas);

    // Check if everything is ok
    if (!frontCanvas) {alert("frontCanvas undefined, does not seem to be supported by your browser");}
    if (!frontCanvas.getContext) {alert('Error: frontCanvas.getContext() undefined !');}

    // Get the context for drawing in the canvas
    var frontContext = frontCanvas.getContext('2d');
    if (!frontContext) {alert("could not get the context for the front canvas");}

    this.getFrontCanvas = function () {
        return frontCanvas;
    }
    this.getFrontContext = function () {
        return frontContext;
    }

    // Canvas doesnt scale well with '%' dimension so we use a little trick.
    // We give them the size of one of their parent node which can be scalable.
    frontCanvas.height = mainCanvas.height = $("#content")[0].clientHeight;
    frontCanvas.width = mainCanvas.width = $("#content")[0].clientWidth;

    // Créer l’outil de dessin
    var drawingTool = new setOfDrawingTools[DEFAULT_TOOL]();

    // lier des événements. Nous utilisons une fonction multiplexEvent qui appellera les écouteurs appropriés
    //méthodes.
    this.bindMultiplexEvents = function () {
        $("#canvasFront").mousedown(this.multiplexEvents);
        $("#canvasFront").mousemove(this.multiplexEvents);
        $("#canvasFront").mouseup(this.multiplexEvents);
    }

    // if currentTool is pencil, and event.type is mousemove, will
    // call pencil.mousemouve(event), if currentTool is line and
    // event.type is mouseup, will call line.mouseup(event) etc.
    this.multiplexEvents = function (event) {
        drawingTool[event.type](event);
    }

    // Handle the drawing tools menu. The selected entry value can be 'Pencil',
    // 'Line' etc.
    this.changeDrawingTool = function () {
        // this.id is the id of the selected menu item
        drawingTool = new setOfDrawingTools[this.id]();
    }
    // Bind the changeDrawingTool function onClick to every menu items.
    $("#drawCommands").find("span").click(this.changeDrawingTool);

    // gérer les couleurs du menus
    mainContext.strokeStyle = frontContext.strokeStyle = "#" + $("#strokeColor").val();
    $("#strokeColor").change(function() {
        mainContext.strokeStyle = frontContext.strokeStyle = "#" + $("#strokeColor").val();
    });

    mainContext.fillStyle = frontContext.fillStyle = "#" + $("#fillColor").val();
    $("#fillColor").change(function() {
        mainContext.fillStyle = frontContext.fillStyle = "#" + $("#fillColor").val();
    });

    // gérer la taille du contour
    mainContext.lineWidth = frontContext.lineWidth = $("#strokeSize").val();
    $("#strokeSize").change(function() {
        mainContext.lineWidth = frontContext.lineWidth = $("#strokeSize").val();
    });

    var fillShapes = true;
    // handle the check box that specifies if we fill shapes
    //this.fillShapes = $("#fillShapes").attr('checked');
    $("#fillShapes").change(function(){
        fillShapes = $(this).attr("checked");
    });

    this.getFillShapesStatus = function(){
        return fillShapes;
    }

     // Draws the front canvas on the main canvas
    this.drawFrontCanvasOnMainCanvas = function () {
        mainContext.drawImage(frontCanvas, 0, 0);
        frontContext.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
    }
};
//Effacer le canvas
