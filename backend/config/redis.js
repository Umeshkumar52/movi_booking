// import IORedis from "ioredis";

// export const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
//   maxRetriesPerRequest: null, // REQUIRED for BullMQ
//   retryStrategy: (times) => Math.min(times * 100, 3000) // Wait up to 3 seconds before trying to reconnect
// });
// connection.on("connect", () =>
//   console.log("✅ Redis Connected")
// );

// connection.on("error", err =>
//   console.error("❌ Redis Error:", err)
// );