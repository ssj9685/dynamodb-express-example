import serverless from "serverless-http";
import { initTodoApp } from "./app/todo/index.js";

const todoApp = initTodoApp();

export const todo = serverless(todoApp);
