/**
 * cluster是nodejs的多线程模块，一下是其标准的使用方法。
 */
const cluster = require('cluster'),
      os      = require('os'),
      stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
      ],
      production = process.env.NODE_ENV == 'production';

var stopping = false;   //阻塞状态：否

cluster.on('disconnect', function(worker) {
  if (production) {
    if (!stopping) {
      cluster.fork();
    }
  } else {
    process.exit(1);
  }
})
//主线程负责开启其他的线程单元
if (cluster.isMaster) {
  const workerCount = os.cpus().length/2;  //numOfCPUs, denpending on the environment
  for (var i = 0; i < workerCount; i++) {
    cluster.fork();
  }
  if (production) {
    stopSignals.forEach(function (signal) {
      process.on(signal, function () {
        console.log(`Got ${signal}, stopping workers...`);
        stopping = true;
        cluster.disconnect(function () {
          console.log('All workers stopped, exiting.');
          process.exit(0);
        });
      });
    });
  }
} else {
  require('./app.js');  //nodejs express http响应模块调用
}
