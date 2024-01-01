//@ts-check
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import express from "express";
import cors from "cors";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { TodoService } from "./service/index.js";
import { DynamoDbClientHelper } from "../../util/db-helper/index.js";

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

  app.get("/todos", async (_, res) => {
    const todos = await TodoService.getItems();

    const { statusCode, totalCount, items } = todos;

    res.status(statusCode);

    res.json({
      totalCount,
      items,
    });
  });

  app.post("/todos", async (req, res) => {
    const { title, completed } = req.body;

    const item = { todoId: randomUUID(), title, completed };

    const command = new PutCommand({
      TableName: "todos",
      Item: item,
    });
    try {
      const todos = await docClient.send(command);

      res.status(todos.$metadata.httpStatusCode ?? 500);

      res.json(item);
    } catch (e) {
      console.error(e);
    }
  });

  app.get("/todos/:todoId", async (req, res) => {
    const { todoId } = req.params;
    const command = new GetCommand({
      Key: {
        todoId,
      },
      TableName: "todos",
    });

    try {
      const todo = await docClient.send(command);

      res.json(todo);
    } catch (e) {
      console.error(e);
    }
  });

  app.listen(port, () => {
    console.log(`port: ${port}`);
  });

  return app;
}
