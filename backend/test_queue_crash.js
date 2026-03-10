import { Queue } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis("redis://127.0.0.1:6379", { maxRetriesPerRequest: null });
connection.on("error", () => {});
const q = new Queue("test", { connection });
setTimeout(() => console.log('Alive!'), 2000);
