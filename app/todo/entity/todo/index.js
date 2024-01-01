import { Entity } from "../base/index.js";

export default Entity.createSchema({
  title: {
    type: "S",
  },
  todoId: {
    type: "S",
  },
  completed: {
    type: "BOOL",
  },
});
