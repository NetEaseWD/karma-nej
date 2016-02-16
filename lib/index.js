var pathLib = require('path');
var glob = require("glob")

function createPattern (path, noInclude) {
  return {pattern: path, included: !noInclude, served: true, watched: false}
}



function nejBoot (config) {
  var files = config.files,
    client = config.client,
    nejOptions = config.nejOptions;

  // 先标准化root Path , 前提是karma.conf 和 pwd 在一个目录下
  nejOptions.root = pathLib.resolve(nejOptions.root || './node_modules/nej');

  // 默认的lib 转换
  client.nejAlias = {
    'lib': pathLib.join('/base', 
        pathLib.relative(config.basePath, nejOptions.root)
      ) + '/src/'
  };

  for(var i in nejOptions.alias){
    var prePath = nejOptions.alias[i] ;
    var path = pathLib.relative( config.basePath, prePath );

    client.nejAlias[i] = pathLib.join('/base', path) + (/(\/|\\)$/.test(prePath)? '/': '');

  }


  files.unshift(createPattern(__dirname + '/adapter.js'))


  // options is optional
  var libPathes = glob.sync( pathLib.join(nejOptions.root ,"src/**/*.js") );
  libPathes.forEach(function(p){
     files.unshift(createPattern(p, true))
  })
  files.unshift(createPattern(
    pathLib.join(nejOptions.root, 'src/define.js')
  ))

}

nejBoot.$inject = ['config']

module.exports = {
  'framework:nej': ['factory', nejBoot]
}
