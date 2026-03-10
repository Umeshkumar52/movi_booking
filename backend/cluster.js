// cluster.js
import cluster from "cluster";
import os from "os";

const totalCPUs = os.cpus().length;
console.log(totalCPUs)
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // auto restart
  });

} else {
  import("./app.js");
}