let disks;
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
let alertPlaceholder = document.getElementById('message')



function alert(message, type) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper)
}

function setBoard() {
  disks = new Array();

  for (let i = 0; i < initialNumOfDisks; i++) {
    disks.push(new Disk(disksNames[i]));
  }
}
window.onload = setBoard;


function handle_start() {

  if(isLastDisk())
  {
    return;
  }
  
  if (pause === true) {
    
    if (init_time_limit())  pause = false;
  }

  else{

    if (init_time_limit()) {
      window.setInterval(function () {
        if (pause === false) {
          updateDisksPositions();
          checkDisksTouched();
          handleTimeCheck();
        }
      }, 10);
      
    }
  }
}

function handle_pause() {
  pause = true;
}

function handle_reset() {
  pause = true;
  resetBoard();
  counter = 0;
  showTimer.innerHTML = counter;
}

function resetBoard() {
  disks.forEach(disk => {
    disk.pos = init_disk_position(disk);
    disk.Disable(false);
  });
}

let i = 0;
function Disk(name) {  
  this.name = name;
  this.obj = document.getElementById(name);
  this.size = this.obj.clientWidth;
  this.radius = this.size / 2;
  this.containerSize = { x: this.obj.offsetParent.offsetWidth, y: this.obj.offsetParent.offsetHeight }
  this.posBoundries = { x: this.containerSize.x - this.size / 2, y: this.containerSize.y - this.size / 2 }
  this.pos = init_disk_position(this);
  this.speed = { x: 1000 * (Math.random() - 0.5), y: 1000 * (Math.random() - 0.5) };
  this.disable = false;

  this.Disable = function (status){

    if(status === true)
    {
      this.obj.style.visibility = "hidden";
      this.disable = true;
    }
    else
    {
      this.obj.style.visibility = "visible";
      this.disable = false;
    }
  };

  // movement to new position
  this.movement = function (x, y) {
    this.pos.x = Math.minPos(this.posBoundries.x, Math.maxPos(this.radius, x));
    this.pos.y = Math.minPos(this.posBoundries.y, Math.maxPos(this.posBoundries.y, y));
  };


  this.updatePosition = function () {
    let diskHitWall;
    function bounce(pos, minPos, maxPos, movement) {
      let range = maxPos - minPos;

      // New position without bounces
      let newPos = pos + movement;
      // Bounce on minPos side
      if (pos - minPos < -movement && -movement < range) {
        diskHitWall = true;
        return (2 * minPos - newPos);
      }
      // Bounce on maxPos side
      if (maxPos - pos < movement && movement < range) {
        diskHitWall = true;
        return (2 * maxPos - newPos);
      }
      // No bounce, or even number of bounces
      diskHitWall = false;
      return ((newPos + 2 * range) % (2 * range));
    }

    // movement
    this.pos.x = bounce(this.pos.x, this.radius, this.posBoundries.x, this.speed.x * 0.01);
    if (diskHitWall)
      this.speed.x = (-this.speed.x);

    this.pos.y = bounce(this.pos.y, this.radius, this.posBoundries.y, this.speed.y * 0.01);
    if (diskHitWall)
      this.speed.y = (-this.speed.y);

    // movement
    this.obj.style.left = (this.pos.x - (this.size / 2)) + "px";
    this.obj.style.top = (this.pos.y - (this.size / 2)) + "px";
  }
}


function updateDisksPositions() {

  for (let i = 0; i < disks.length; i++) {
    disks[i].updatePosition();
  }
}

function checkDisksTouched() {

  for (let i = 0; i < disks.length; i++) 
  {
    for (let j = i + 1; j < disks.length; j++) {

      if (twoDisksTouched(disks[i], disks[j])) {
        if(generateRandomBoolean())
        {
          disks[j].Disable(true);
        }
        else disks[i].Disable(true);

        if(isLastDisk()) 
        {
          handle_pause();
          handle_endgame();
        }
      }
    }
  }
}

function twoDisksTouched(disk1, disk2) {
  let xDistance = disk2.pos.x - disk1.pos.x;
  let yDistance = disk2.pos.y - disk1.pos.y;
  return !disk1.disable && !disk2.disable && (Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)) < disk1.radius + disk2.radius);
}

function generateRandomBoolean() {
  return Math.round(Math.random())
}

function isLastDisk()
{
  let cnt = 0;
  disks.forEach(d => {
    if (d.disable) cnt++ ;
  });

  return cnt === initialNumOfDisks - 1;
}

//returns true if time limit is valid
//otherwise returns false
function init_time_limit() {
  let time = document.querySelector('#time_limit').value;

  if (time) {
    for (let i = 0; i < time.length; i++) {
      const digit = time[i];
      if (digit < '0' || digit > '9') {
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

function handleTimeCheck() {

  if (counter === time_limit) {
    handle_pause();
    handle_endgame();
  }
  else {
    counter++;
    showTimer.innerHTML = counter;
  }
}

function handle_endgame()
{
  alert('Game Over', 'success')
}


function init_disk_position(disk) 
{
  pos = { x: 0, y: 0 };

  if (disk.obj.id === disksNames[0]) {
    pos.y = 0;
    pos.x = random_width(disk.radius);
  }

  else if (disk.obj.id === disksNames[1]) {
    pos.y = random_height(disk.radius);
    pos.x = 0;
  }

  else if (disk.obj.id === disksNames[2]) {
    pos.y = document.getElementById("container").clientHeight - 2 * disk.radius;
    pos.x = random_width(disk.radius);
  }

  else if (disk.obj.id === disksNames[3]) {
    pos.y = random_height(disk.radius);
    pos.x = document.getElementById("container").clientWidth - 2 * disk.radius;
  }

  disk.obj.style.left = pos.x + 'px'
  disk.obj.style.top = pos.y + 'px';

  return pos;
}

// randomize a value from 0 to max rectangle width
function random_width(radius) {
  return 2 * radius + Math.random() * (1000 % (document.getElementById("container").clientWidth - 2 * radius));
}


// randomize a value from 0 to max rectangle height
function random_height(radius) {
  return (2 * radius + Math.random() * (1000 % (document.getElementById("container").clientHeight - 2 * radius)));
}