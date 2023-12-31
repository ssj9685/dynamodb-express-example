import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

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

const docClient = DynamoDBDocumentClient.from(client);

const app = express();
app.use(express.json());
app.use(cors());
const port = 8081;

const Tables = {
  Todos: "todos",
};

app.get("/todos", async (_, res) => {
  const command = new ScanCommand({
    TableName: Tables.Todos,
  });
  try {
    const todos = await docClient.send(command);

    res.status(todos.$metadata.httpStatusCode ?? 500);

    res.json({
      totalCount: todos.Count,
      items: todos.Items,
    });
  } catch (e) {
    console.error(e);
  }
});

app.post("/todos", async (req, res) => {
  const { title, completed } = req.body;

  const item = { todoId: randomUUID(), title, completed };

  const command = new PutCommand({
    TableName: Tables.Todos,
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
    TableName: Tables.Todos,
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

export const handler = serverless(app);

export default {
  handler: (event, context) => {
    const response = handler(event, context);
    return response;
  },
};
