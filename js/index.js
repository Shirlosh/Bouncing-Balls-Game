

//****** CONSTANTS ******//
// const DISK1 = "disk1";
// const DISK2 = "disk2";
// const DISK3 = "disk3";
// const DISK4 = "disk4";
// const POS = "pos";
//**********************//

//****** VARIABLES ******//
let disk_id = null;
let timer_id = null;
let enabled = true;
let counter = 0;

let disks = new Array();
const btn_start = document.querySelector( '#btn_start');
const btn_stop = document.querySelector( '#btn_stop');
const btn_reset = document.querySelector( '#btn_reset');
const div_value = document.querySelector('#div_value');
const rectangle = document.querySelector( '#Rectangle');
let time_limit = null;
//**********************//

btn_start.addEventListener( 'click', handle_start);
btn_stop.addEventListener( 'click', handle_stop);
btn_reset.addEventListener( 'click', handle_reset);
create_disk_array(4);


function Disk(name) {
  
  this.obj = document.getElementById(name);
  this.pos = 1; 
  this.radius = this.obj.offsetWidth/2;


  /// TODO : change condition(pos == 350) to some function thats check if reachead to the last ball
  /// if reached board limitation bound to the other direction 
  this.move= function() {
    if(enabled == true)
    {
      if (this.pos == 350) {
        clearInterval(disk_id);
      } else {
        //this.pos++; 
        this.obj.style.top = parseInt(this.obj.style.top, 10) + this.pos + 'px'; 
        this.obj.style.left = parseInt(this.obj.style.left, 10) + this.pos + 'px'; 
      }
    }
  }
}


//****** FUNCTIONS ******//

// create disks dynamic array where each cell contain a disk
function create_disk_array(size)
{
  for(let i = 1; i <= size; i++) 
  {
    let name = "disk" + i;
    let elem = document.createElement('div');
    elem.setAttribute("id", name);
    elem.setAttribute("class", "disk"); 
    document.getElementById("Rectangle").appendChild(elem);
    disks.push(new Disk(name));
    
    init_disk_position(disks[i-1]);
  }
}

//randomize a disk position
//each disk get has own rectangle line
function init_disk_position(disk)
{
  if(disk.obj.id === 'disk1')
  {
    disk.obj.style.top = 0 + 'px';
    disk.obj.style.left = random_width();
  }

  else if(disk.obj.id === 'disk2')
  {
    disk.obj.style.top =  random_height();
    disk.obj.style.left = 0 + 'px';
  }

  else if(disk.obj.id === 'disk3')
  {
    disk.obj.style.top =  rectangle.clientHeight - 2*disk.radius + 'px';
    disk.obj.style.left = random_width();
  }

  else if(disk.obj.id === 'disk4')
  {
    disk.obj.style.top = random_height();
    disk.obj.style.left =  rectangle.clientWidth - 2*disk.radius + 'px';
  }
}

// randomize a value from 0 to max rectangle width
function random_width()
{
  let radius = disks[0].radius;
  return (2*radius + Math.random()*(1000 % (rectangle.clientWidth - 2*radius))) + 'px';
}


// randomize a value from 0 to max rectangle height
function random_height()
{
  let radius = disks[0].radius;
  return (2*radius + Math.random()*(1000 % (rectangle.clientHeight - 2*radius))) + 'px';
}

function handle_start()
{
    if (init_time_limit())
    {      
      clearInterval(disk_id);
      clearInterval(timer_id);    
      timer_id = window.setInterval(handle_tick, 100)
      
      disk_id = window.setInterval(function() {
         disks.forEach(disk => disk.move()); 
        }, 1);  
    }
    enabled = true; 
}

function handle_stop()
{
    if ( !disk_id ) return;
    enabled = false
}


function handle_reset()
{
    if ( !disk_id ) return;
    enabled = false;
    counter = 0;
    disks.forEach(disk => {
      init_disk_position(disk);  
    });
    div_value.innerHTML = 'Not Started...';
}

// increase the tick counter
// prints the counter to the screen
function handle_tick()
{
    if ( !enabled) return;
    if(counter === time_limit) handle_stop();
    else 
    {
      counter++;
      div_value.innerHTML = counter;
    }
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

