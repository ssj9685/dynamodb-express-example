//@ts-check
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import express from "express";
import cors from "cors";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDbClientHelper } from "../../util/db-helper/index.js";
import todoController from "./controller/index.js";

export function initTodoApp() {
  const { DYNAMODB_ACCESS_KEY, DYNAMODB_SECRET_ACCESS_KEY, DYNAMODB_REGION } =
    process.env;

  if (!DYNAMODB_ACCESS_KEY || !DYNAMODB_SECRET_ACCESS_KEY) {
    throw new Error("Please set dynamodb credentials in env file");
  }

  const client = new DynamoDBClient({
    region: DYNAMODB_REGION,
    credentials: {
      accessKeyId: DYNAMODB_ACCESS_KEY,
      secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY,
    },
  });

  const dbHelper = new DynamoDbClientHelper(client);

  const docClient = DynamoDBDocumentClient.from(client);

  const app = express();
  app.use(express.json());
  app.use(cors());
  const port = 8081;

  app.use("/todos", todoController);

  app.listen(port, () => {
    console.log(`port: ${port}`);
  });

  return app;
}
