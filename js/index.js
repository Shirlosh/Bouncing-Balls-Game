

//****** CONSTANTS ******//
const DISK1 = "disk1";
const DISK2 = "disk2";
const DISK3 = "disk3";
const DISK4 = "disk4";
const POS = "pos";
//**********************//

//****** VARIABLES ******//
let id = null;
let enabled = true;
let counter = 0;
const btn_start = document.querySelector( '#btn_start');
const btn_stop = document.querySelector( '#btn_stop');
const btn_reset = document.querySelector( '#btn_reset');
const div_value = document.querySelector('#div_value');
//**********************//

btn_start.addEventListener( 'click', handle_start);
btn_stop.addEventListener( 'click', handle_stop);
btn_reset.addEventListener( 'click', handle_reset);
document.getElementById(DISK1).setAttribute(POS,0);
document.getElementById(DISK2).setAttribute(POS,0);
document.getElementById(DISK3).setAttribute(POS,0);
document.getElementById(DISK4).setAttribute(POS,0);


//****** FUNCTIONS ******//
function handle_start()
{
      let elem = document.getElementById("disk1");   
      let pos = elem.getAttribute("pos");
      clearInterval(id);
      id = setInterval(move, 1);
      function move()
      {
        if(enabled == true)
        {
          if (pos == 350) {
            clearInterval(id);
          } else {
            pos++; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
          }
        }
      }  
      enabled = true; 
}

function handle_stop()
{
    if ( !id ) return;
    enabled = false
}

function handle_reset()
{
    if ( !id ) return;
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