

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
//**********************//

btn_start.addEventListener( 'click', handle_start);
btn_stop.addEventListener( 'click', handle_stop);
btn_reset.addEventListener( 'click', handle_reset);
create_disk_array(4);


function Disk(name) {
  
  this.obj = document.getElementById(name);
  this.pos = 0; 
  this.radius = this.obj.offsetWidth/2;

  this.move= function() {
    if(enabled == true)
    {
      if (this.pos == 350) {
        clearInterval(disk_id);
      } else {
        this.pos++; 
        this.obj.style.top = this.pos + 'px'; 
        this.obj.style.left = this.pos + 'px'; 
      }
    }
  }
}


//****** FUNCTIONS ******//
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

function random_width()
{
  let radius = disks[0].radius;
  return (2*radius + Math.random()*(1000 % (rectangle.clientWidth - 2*radius))) + 'px';
}

function random_height()
{
  let radius = disks[0].radius;
  return (2*radius + Math.random()*(1000 % (rectangle.clientHeight - 2*radius))) + 'px';
}

function handle_start()
{
    clearInterval(disk_id);
    timer_id = window.setInterval(handle_tick, 100 )
    disk_id = window.setInterval(function() { disks[0].move(); }, 1);
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
    div_value.innerHTML = 'Not Started...';
}

function handle_tick()
{
    if ( !enabled) return;
    counter++;
    div_value.innerHTML = counter;
}