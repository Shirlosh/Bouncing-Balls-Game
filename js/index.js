let disks;
let const_disk_array;
let disksNames = ["disk1", "disk2", "disk3", "disk4"]
let initialNumOfDisks = disksNames.length;


const btn_start = document.querySelector('#btn_start');
const btn_pause = document.querySelector('#btn_pause');
const btn_reset = document.querySelector('#btn_reset');
const showTimer = document.querySelector('#timer');
let time_limit = null;
let counter = 0;
let pause = false;

btn_start.addEventListener('click', handle_start);
btn_pause.addEventListener('click', handle_pause);
btn_reset.addEventListener('click', handle_reset);
var alertPlaceholder = document.getElementById('message')



function alert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
}

function setBoard()
{
  disks = new Array();
  
  for(let i = 0; i < initialNumOfDisks; i++)
  {
    disks.push(new ball(disksNames[i]));
  }
}
window.onload = setBoard;

function resetBoard()
{
  disks.forEach(disk => {
    disk.pos = init_disk_position(disk);
    disk.obj.style.visibility = "visible";
  });
}

function startGame()
{
  // init random speed
  for (let i= 0; i < disks.length; i++) {
    disks[i].speed.x= 1000*(Math.random()-0.5);
    disks[i].speed.y= 1000*(Math.random()-0.5);
  }
}

function handle_start()
{
  if(pause === true)
  {
    pause = false;
  }

  else {

    if (init_time_limit())
    {
      alert('Game Started!', 'success')
      
      window.setInterval(function(){
        
        if(pause === false)
        {
          updateDisksPositions();
          checkDisksTouched();
          handleTimeCheck();
        }
      }, 10);
  
      startGame();
    }  
  }  
}

function handle_pause()
{
  pause = true;
}

function handle_reset()
{
  pause = true;
  resetBoard();
  counter = 0;
  showTimer.innerHTML = counter;
}

function ball(name) {
  // init object
  this.name= name;
  this.obj= document.getElementById(name);
  this.size = this.obj.clientWidth // or clientHeight
  this.radius= this.size/2
  this.containerSize= { x: this.obj.offsetParent.offsetWidth, y: this.obj.offsetParent.offsetHeight}
  this.posBoundries= { x: this.containerSize.x-this.size/2, y: this.containerSize.y-this.size/2}
  // init position
  this.pos= init_disk_position(this);

  // init speed
  this.speed= { x: 0, y: 0 };  

  // Update time
  var time = (new Date()).getTime()/1000;


  // movement to new position
  this.movement = function(x, y){
    this.pos.x= Math.minPos(this.posBoundries.x, Math.maxPos(this.radius, x));
    this.pos.y= Math.minPos(this.posBoundries.y, Math.maxPos(this.posBoundries.y, y));
  };


  this.updatePosition= function()
  {
    var diskHitWall;
    function bounce(pos, minPos, maxPos, movement)
    {
      var range= maxPos-minPos;

      // New position without bounces
      var newPos= pos+movement;
      // Bounce on minPos side
      if (pos-minPos < -movement && -movement < range) {
        diskHitWall= true;
        return (2 * minPos - newPos);
      }
      // Bounce on maxPos side
      if (maxPos-pos < movement && movement < range) {
        diskHitWall= true;
        return (2 * maxPos - newPos);
      }
      // No bounce, or even number of bounces
      diskHitWall= false;
      return ((newPos + 2 * range) % (2 * range));
    }
    
    var now = (new Date()).getTime()/1000;
    var dt = now - time; // A very small number.
    time = now; 
    // movement
    this.pos.x = bounce(this.pos.x, this.radius, this.posBoundries.x, this.speed.x*dt);
    if(diskHitWall)
      this.speed.x = (-this.speed.x);

    this.pos.y = bounce(this.pos.y, this.radius, this.posBoundries.y, this.speed.y*dt);
    if(diskHitWall)
      this.speed.y = (-this.speed.y);
    
    // movement
    this.obj.style.left = (this.pos.x - (this.size / 2)) + "px";
    this.obj.style.top = (this.pos.y - (this.size / 2)) + "px";
  } 
}


function updateDisksPositions()
{

   for(let i = 0; i < disks.length; i++)
  {
     disks[i].updatePosition();
   }
}

function checkDisksTouched()
{

    //let removedDiskIndex = i;
  let j = 0;
  for(let i = 0; i < disks.length - 1; i++)
  {
      if(j === disks.length)
        continue;
      j = i + 1
      if(twoDisksTouched(disks[i].pos.x, disks[i].pos.y, disks[i].radius, disks[j].pos.x, disks[j].pos.y, disks[j].radius))
      {
        /* random pick a disk to remove.
        if(generateRandomBoolean() === 0)
        {
          removementdDiskIndex = i;
        }
        else
        {
          removementdDiskIndex = j;
        }
        */

        disks[j].obj.style.visibility = "hidden";
        //document.getElementById(disks[j].name).remove();
        //disks.splice(j, j); //remove disk[j]
      }
    }
}

function twoDisksTouched(x1, y1, radius1, x2, y2, radius2)
{
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return (Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) < radius1 + radius2);
}

function generateRandomBoolean()
{
  return Math.round(Math.random())
}

//returns true if time limit is valid
//otherwise returns false
function init_time_limit()
{
  let time = document.querySelector( '#time_limit').value;

  if(time)
  {
    for( let i = 0 ; i < time.length ; i++)
    {
      const digit = time[i];
      if ( digit < '0' || digit > '9')
      {
        alert('please enter only numbers')
        time_limit = null;
        return false;
      }
    }
    time = Number(time);
  }

  time_limit = time;
  return true;
}

function handleTimeCheck()
{

    if(counter === time_limit)
    {
      handle_pause();
    } 
    else 
    {
      counter++;
      showTimer.innerHTML = counter;
    }
}

// function showDisks()
// {
//   for(let i = 0; i < disks.length; i++)
//   {
//     document.getElementById(disks[i].name).style.display = "block";
//   }
// }

// function pauseDisks()
// {
//   for(let i = 0; i < disks.length; i++)
//   {
//     disks[i].speed.x = 0;
//     disks[i].speed.y = 0;
//   }
// }

function init_disk_position(disk)
{
  pos = {x:0,y:0};
  if(disk.obj.id === disksNames[0])
  {
    pos.x = 0;
    pos.y = random_width(disk.radius);
  }

  else if(disk.obj.id === disksNames[1])
  {
    pos.x = random_height(disk.radius);
    pos.y = 0;
  }

  else if(disk.obj.id === disksNames[2])
  {
    pos.x = document.getElementById("container").clientHeight - 2*disk.radius;
    pos.y = random_width(disk.radius);
  }

  else if(disk.obj.id === disksNames[3])
  {
    pos.x = random_height(disk.radius);
    pos.y = document.getElementById("container").clientWidth - 2*disk.radius;
  }

  disk.obj.style.top = pos.x + 'px';
  disk.obj.style.left = pos.y + 'px'
  return pos;
}

// randomize a value from 0 to max rectangle width
function random_width(radius)
{
  return 2*radius + Math.random()*(1000 % (document.getElementById("container").clientWidth - 2*radius));
}


// randomize a value from 0 to max rectangle height
function random_height(radius)
{
  return (2*radius + Math.random()*(1000 % (document.getElementById("container").clientHeight - 2*radius)));
}