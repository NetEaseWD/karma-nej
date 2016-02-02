(function(karma, nejDefine, locationPathname) {

// Monkey patch nej

var config = karma.config;
var alias = config.nejAlias;
Array.isArray = Array.isArray || function(arr){
  return ({}).toString.call(arr) === '[object Array]';
}




var _reg = /{(.*?)}/gi,
  _reg4= /\.js$/i,
  _reg5= /^[{\/\.]/;

var _absolute = function(_uri){
    return _uri.indexOf('://')>0;
};


if(typeof console !== 'undefine'){
  // Monkey Patching console.log
  var prelog = console.log;
  console.log = function(message){
    // 禁止NEJ的log 信息
    if( (''+message).indexOf('do ') === 0) return;
    return prelog.apply(console, arguments);
  }
}



var _amdpath = function(_uri, _type){
  // start with {xx} or /xx/xx or ./ or ../
  // end with .js
  // absolute uri
  if (_reg4.test(_uri)||
      _reg5.test(_uri)||
      _absolute(_uri)
      ){
      return _uri;
  }
  // lib/base/klass -> {lib}base/klass.js
  // pro/util/a     -> {pro}util/a.js
  var _arr = _uri.split('/'),
      _path = alias[_arr[0]],
      _sufx = !_type?'.js':'';
  if (!!_path){
      _arr.shift();
      return _path+_arr.join('/')+_sufx;
  }
  // for base/klass -> {lib}base/klass.js
  return '{lib}'+_arr.join('/')+_sufx;
};


function normalizePath( path ){
  var tmp = path.split('!'), type;
  if(tmp[1]){
    type = tmp[0];
    path = tmp[1];
  }else{
    path = tmp[0];
  }


  return  ((type? type + '!': '') + _amdpath(path, type )).replace(_reg, function(all, name){
    
    return alias[name] || '';
  }) ;

}

function processDep( dep ){
  return normalizePath( dep );
}

window.define = function(){
  var args = [].slice.call(arguments).map(function(arg){
    if(Array.isArray(arg)) return arg.map(function(dep){
      return processDep(dep)
    }) 
    return arg
  })
  nejDefine.apply( window, args);
}

karma.loaded = function(){}


})(window.__karma__, window.define, window.location.pathname);
