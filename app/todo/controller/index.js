//@ts-check
import { Router } from "express";
import { TodoService } from "../service/index.js";
import { randomUUID } from "crypto";

const todoController = Router();

todoController.get("/", async (_, res) => {
  const todos = await TodoService.findAll();

  const { statusCode, totalCount, items } = todos;

  res.status(statusCode);

  res.json({
    totalCount,
    items,
  });
});

todoController.post("/", async (req, res) => {
  const { title, completed } = req.body;

  const item = { todoId: randomUUID(), title, completed };

  const result = await TodoService.create(item);

  const { statusCode } = result;

  res.sendStatus(statusCode);
});

todoController.get("/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const todos = await TodoService.findById(todoId);

  const { statusCode, totalCount, items } = todos;

  res.status(statusCode);

  res.json({
    totalCount,
    items,
  });
});

export default todoController;
