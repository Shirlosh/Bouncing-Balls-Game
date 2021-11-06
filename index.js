let id = null;
let enabled = true;
let counter = 0;

const btn_start = document.querySelector( '#btn_start');
btn_start.addEventListener( 'click', handle_start);

const btn_stop = document.querySelector( '#btn_stop');
btn_stop.addEventListener( 'click', handle_stop);

const btn_reset = document.querySelector( '#btn_reset');
btn_reset.addEventListener( 'click', handle_reset);

const div_value = document.querySelector('#div_value');

function handle_start()
{
    // if ( !timer_id )
    //     timer_id = window.setInterval(  handle_tick, 100 )
    // enabled = true  

      let elem = document.getElementById("disk1");   
      let pos = 0;
      clearInterval(id);
      id = setInterval(move, 10);
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

