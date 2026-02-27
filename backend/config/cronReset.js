import cron from "node-cron";
import Subscription from "./models/Subscription.js";

cron.schedule("0 1 1 * *", async () => {
  console.log("Resetting subscription usage...");
  await Subscription.updateMany({}, { usedMovies: 0 });
});