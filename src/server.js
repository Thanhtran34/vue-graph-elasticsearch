//Create an express API with endpoint to query data from Elasticsearch
import {client} from './elastic/connection.js'
import express from "express";
import cors from "cors";
import { router } from "./routes/router.js";

// The main function of the application.
const main = async () => {
  const app = express();
  // To allow cross origin connections so that the webapp can connect to our server
  app.use(cors());

  // Register routes.
  app.use("/", router);

  app.listen(process.env.PORT, () => {
    console.log(`App is running at ${process.env.PORT}`);
    console.log("Press Ctrl-C to terminate...");
  });
};

main().catch(console.error);
