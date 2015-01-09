// 
// Avinash Kundaliya - avinash@avinash.com.np
//
// basically wraps websockets and makes life easier if you want it to reconnect
// works exactly like a websocket client.
// usage : var ws = new stickyWebSocket("ws://awesome:port");
// supports onopen, onclose, onconnecting, onerror events 
// use ws.send() and ws.close() to send and close respectively
//
// uses the exponential backoff algorithm from 
// http://dthain.blogspot.nl/2009/02/exponential-backoff-in-distributed.html

function stickyWebSocket(url, protocols) {
  this.debug = false;
  this.timeout = 10;
  this.fixedDelay = 2;
  this.retries = 0;
  this.maxDelay = 30000;
  this.onopen = function(e){};
  this.onclose = function(e){};
  this.onconnecting = function(e){};
  this.onerror = function(e){};
  this.onmessage = function(e){};

  var closed = false;
  var ws;
  var timeout;
  var sws = this;

  this.send = function(data) {
    logDebug("SWS - sending data");
    return ws.send(data);
  };

  this.close = function(){
    logDebug("SWS - closing, tata bye bye!");
    closed = true;
    ws.close();
  };

  function logDebug(message){
    if(sws.debug)
      console.log(message);
  }

  // http://dthain.blogspot.nl/2009/02/exponential-backoff-in-distributed.html
  // using an exponential backoff algorithm to try to reconnect to the server
  function getDelay(){
    var r = (Math.random()*2); // random number 1-2
    var delay = r*sws.timeout*Math.pow(sws.fixedDelay,sws.retries);
    sws.retries++;
    if(delay > sws.maxDelay)
      return sws.maxDelay;
    return delay;
  }

  function init(){
    logDebug("SWS - attempting to connect");
    ws = new WebSocket(url, protocols);
    sws.readystate = ws.readystate;


    ws.onopen = function(e){
      logDebug("SWS - connected yay!");
      clearTimeout(timeout);
      sws.retries = 0;
      sws.onopen(e);
    };

    ws.onclose = function(e){
      logDebug("SWS - connection closed");
      clearTimeout(timeout);

      // do this only if it was not manually closed
      if(!closed){
        var delay = getDelay();
        logDebug("SWS - trying to reconnect in "+ delay);
        timeout = setTimeout(function(){
          init();
        }, delay);
      }
      sws.onclose(e);
    };

    ws.onmessage = function(e){
      logDebug("SWS - got a message");
      sws.onmessage(e);
    };

    ws.onerror = function(e){
      logDebug("SWS - whoopsie error");
      sws.onerror(e);
    };
  }
  init();
}
