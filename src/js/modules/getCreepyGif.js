/******************************************************************/
// AJAX helper
var getJSON = function(url, cb){
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      cb(data);
    } else {
      // We reached our target server, but it returned an error
      console.warn("getJSON: target server returned an error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.error("getJSON: connection error");
  };

  request.send();
};

/******************************************************************/
// Get that creepy gif!
// some help: http://speckyboy.com/2014/01/22/building-simple-reddit-api-webapp-using-jquery/

// get all the data from reddit and create an array of just the GIFs
var redditURL = 'http://www.reddit.com/r/creepygifs.json';

var creepyArray = [];

var getRandomFromArray = function(arr) {
  var num = Math.floor(Math.random()*(arr.length - 1));
  //console.log(arr.length, num);
  return arr[num];
};

var fixImgur = function(gif){
  if (/i\.imgur/i.test(gif)) {
    return gif;
  } else {
    var g = gif.split("/");
    return 'http://i.imgur.com/' + g[g.length - 1] + '.gif';
  }
};

var callback = null;

var checkArray = function(cb){
  var stopcheck = 0;

  if (creepyArray.length > 0) {
    var gif = getRandomFromArray(creepyArray);
    if (/imgur/i.test(gif)) { 
      // console.log(gif);
      gif = fixImgur(gif);
      return callback(gif);
    } else {
      return callback(gif);
    }
  } else {
    // keep looking
    if (stopcheck < 101) {
      stopcheck++;
      window.setTimeout(checkArray, 10);
    }
  }
};

module.exports = function(cb){
  
  getJSON(redditURL, function(json){
    var listing = json.data.children;
    for(var i=0, l=listing.length; i<l; i++) {
      var obj = listing[i].data;
      creepyArray.push(obj.url);
    } // end for{} loop
  });
  callback = cb;
  checkArray();
};