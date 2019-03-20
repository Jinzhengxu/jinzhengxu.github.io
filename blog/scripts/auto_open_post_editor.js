var spawn = require('child_process').spawn;
hexo.on('new', function(data){
  spawn('moeditor', [data.path], { stdio: 'inherit' } );
});
