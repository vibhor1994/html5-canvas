//global variables
var paintArea = document.getElementById("paintArea");//to get canvas element
var ctx = paintArea.getContext("2d");//build in object with properties and methods for drawing
var printArea = document.getElementById("test");//div to show realtime coordinates of cursor
var isMouseDown = false;//to check if mouse button is pressed
var isDragged=false;//to check if mouse is dragged
var canRplace=false;//to check to replace old values with new
var x,y,height=0,width=0,a,b,index;
rectan = [];//array to store rectangle properties
count = 0;//rectan.lenth was not working so i used this instead to get length
var isExist = false;//to check if there is already a rectangle


var foo = paintArea.getBoundingClientRect();//returns position relative to viewport

paintArea.addEventListener('mousedown',cnvs_getCoordinatesDown);//event listner to call funtion when mouse is pressed
paintArea.addEventListener('mouseup',cnvs_getCoordinatesUp);//event listner to call funtion when mouse is pressed

//funtion to get random hex color codes
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}//end getRandomColor

//funtion to get realtime coordinates of cursor in canvas
function cnvs_getCoordinates(e)
{
a=e.clientX-foo.left;
b=e.clientY-foo.top;
document.getElementById("test").innerHTML="Coordinates: (" + a + "," + b + ")";
// executes when mouse button is pressed and already a rectangle is at the position.and to drag the rectangle
  if(isMouseDown && isExist){
    newX=x-rectan[index].oldX;
    newY=y-rectan[index].oldY;
   rectan[index].x = a-newX;
   rectan[index].y = b-newY;
   ctx.clearRect(0,0,paintArea.width,paintArea.height);
   drawrect(count);
   canRplace = true;

  }
//executes when mouse button is pressed and there is no rectangle at the coordinate.its draw a stroked rectangle
  else if(isMouseDown && !isExist){
    ctx.fillStyle = "black";
    ctx.clearRect(0,0,paintArea.width,paintArea.height);
    drawrect(count);
    ctx.strokeRect(x,y,a-x,b-y);
    isDragged = true;
  }
//executes when mouse button is not pressed and there is no existing rectangle and when the dragged is performed.it draw the rectangle and pushes rectangle object to array
  else if(!isMouseDown && !isExist && isDragged){
  var color = getRandomColor();
  ctx.fillStyle = color;
  ctx.clearRect(0,0,paintArea.width,paintArea.height);
  ctx.fillRect(x,y,width,height);
  var rect = {
  color:color,
  x:x,
  oldX:x,
  y:y,
  oldY:y,
  width:width,
  height:height
  };
  rectan.push(rect);
  count++;
  drawrect(count);
  isDragged = false;
  canRplace = false;
  }
}//end of cnvs_getCoordinates

//funtion when mouse button is  pressed and to check existence of rectangle at the coordinates
function cnvs_getCoordinatesDown(e)
{
isMouseDown = true;
x=e.clientX-foo.left;
y=e.clientY-foo.top;
//if the canvas is empty
if (count == 0) {
    isExist = false;
}else {//if it already contain rectangles
  for (i=count-1;i>=0;i--){
    var left = rectan[i].x;
    var right = rectan[i].width+rectan[i].x;
    var top = rectan[i].y;
    var bottom = rectan[i].height+rectan[i].y;
    //to check if x and y are in existing rectangle is true returns isExist.
      if(right >= x
                  && left <= x
                  && bottom >= y
                  && top <= y){

        colorSet =rectan[i].color;
        index = i;
        return isExist =true;
      }else {
        isExist = false;
      }
  }

}
}//end of cnvs_getCoordinatesDown

//function when mouse button is released and to change old coordinates of rectangle draged with new.
function cnvs_getCoordinatesUp(e)
{
isMouseDown = false;
width=e.clientX-foo.left-x;
height=e.clientY-foo.top-y;
  if(canRplace){
  rectan[index].oldX=rectan[index].x;
  rectan[index].oldY=rectan[index].y;
}
}//end of cnvs_getCoordinatesUp

//funtion to draw rectangles in rectan array after clearRect is called
function drawrect(count){
  for (i=0;i<count;i++){
    ctx.fillStyle = rectan[i].color;
    ctx.fillRect(rectan[i].x,rectan[i].y,rectan[i].width,rectan[i].height);
  }
}//end of drawrect

// funtion to clear coordinates in test element when mouse leaves the canvas element
function cnvs_clearCoordinates()
{
document.getElementById("test").innerHTML="";
}//end of cnvs_clearCoordinates

//funtion to reset canvas when reset button is clicked
function clearCanvas(){
  ctx.clearRect(0,0,paintArea.width,paintArea.height);
  rectan = [];
  count = 0;
}//end of clearCanvas

//double click event listner to delet a rectangle
paintArea.addEventListener("dblclick", function(event){
    event.preventDefault();
    da=event.clientX-foo.left;
    db=event.clientY-foo.top;
    for (i=count-1;i>=0;i--){
      var left = rectan[i].x;
      var right = rectan[i].width+rectan[i].x;
      var top = rectan[i].y;
      var bottom = rectan[i].height+rectan[i].y;
      if(right >= da
                  && left <= da
                  && bottom >= db
                  && top <= db){
        ind = i;
        rectan.splice(ind,1);
        count--;
        ctx.clearRect(0,0,paintArea.width,paintArea.height);
        drawrect(count);

      }else {
      }
    }
    canRplace = false;
});//end of function
