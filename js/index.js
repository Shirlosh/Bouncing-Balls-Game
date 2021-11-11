let disks = new Array();
let disksNames = ["disk1", "disk2", "disk3", "disk4"]
let initialNumOfDisks = disksNames.length;


const btn_start = document.querySelector('#btn_start');
const btn_pause = document.querySelector('#btn_pause');
const btn_reset = document.querySelector('#btn_reset');
const showTimer = document.querySelector('#timer');
let time_limit = null;
let counter = 0;

btn_start.addEventListener('click', handle_start);
btn_pause.addEventListener('click', handle_pause);
btn_reset.addEventListener('click', handle_reset);


var alertPlaceholder = document.getElementById('message')

function alert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
}

function startGame()
{
  for(let i = 0; i < initialNumOfDisks; i++)
  {
    disks.push(new ball(disksNames[i]));
  }

  //showDisks();

  // init random speed
  for (let i= 0; i < disks.length; i++) {
    disks[i].speed.x= 1000*(Math.random()-0.5);
    disks[i].speed.y= 1000*(Math.random()-0.5);
  }
}

function handle_start()
{
  if (init_time_limit())
  {
    alert('Game Started (message example)!', 'success')
    showDisks();
    
    if(disks.length === 0)
    {
      startGame();
    }
    else //Resume Game
    {
      //save disks speeds in array and restore them
    }
  }      
}

function handle_pause()
{
  pauseDisks();
}

function handle_reset()
{
  for(let i = 0; i < disks.length; i++)
  {
    disks.pop();
  }
  startGame();
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
  this.pos= { x: this.radius + 1000*(Math.random()), y: this.radius + 1000*(Math.random())};
  // init speed
  this.speed= { x: 0, y: 0 };  

  // Update time
  var time = (new Date()).getTime()/1000;
  
  // movement to new position
  this.movement = function(x, y){
    this.pos.x= Math.minPos(this.posBoundries.x, Math.maxPos(this.radius, x));
    this.pos.y= Math.minPos(this.posBoundries.y, Math.maxPos(this.posBoundries.y, y));
  };

  window.setInterval(function(){
      updateDisksPositions();
      checkDisksTouched();
      handleTimeCheck();
  }, 10);
  
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
        document.getElementById(disks[j].name).remove();
        disks.splice(j, j); //remove disk[j]
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

function showDisks()
{
  for(let i = 0; i < disks.length; i++)
  {
    document.getElementById(disks[i].name).style.display = "block";
  }
}

function pauseDisks()
{
  for(let i = 0; i < disks.length; i++)
  {
    disks[i].speed.x = 0;
    disks[i].speed.y = 0;
  }
}
