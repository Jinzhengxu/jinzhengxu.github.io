var spawn = require('child_process').spawn;
hexo.on('new', function(data){
  spawn('atom', [data.path], { stdio: 'inherit' } );
});
