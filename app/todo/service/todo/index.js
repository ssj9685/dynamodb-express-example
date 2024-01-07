//@ts-check
import { DynamoDbClientHelper } from "../../../../util/db-helper/index.js";
import { DynamoDBQueryBuilder } from "../../../../util/query-builder/index.js";
import TodoEntity from "../../entity/todo/index.js";
import { BaseService } from "../base/index.js";

export class TodoService extends BaseService {
  static async findAll() {
    const queryBuilder = new DynamoDBQueryBuilder();

    try {
      const todos = await DynamoDbClientHelper.executeStatement(
        queryBuilder.select().from("todos")
      );

      return {
        statusCode: todos.$metadata.httpStatusCode ?? 500,
        totalCount: todos.Items?.length,
        items: todos.Items?.map((item) => super.convertAttr(TodoEntity, item)),
      };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {{todoId: string; title: string; completed: boolean}} param
   * @returns {Promise<{statusCode: number}>}
   */
  static async create(param) {
    const queryBuilder = new DynamoDBQueryBuilder();

    try {
      const todos = await DynamoDbClientHelper.executeStatement(
        queryBuilder.insert("todos", param)
      );

      return {
        statusCode: todos.$metadata.httpStatusCode ?? 500,
      };
    } catch (error) {
      console.error(error);
    }
  }

  /** @param {string} todoId */
  static async findById(todoId) {
    const queryBuilder = new DynamoDBQueryBuilder();

    try {
      const todos = await DynamoDbClientHelper.executeStatement(
        queryBuilder.select().from("todos").where(`todoId='${todoId}'`)
      );

      return {
        statusCode: todos.$metadata.httpStatusCode ?? 500,
        totalCount: todos.Items?.length,
        items: todos.Items?.map((item) => super.convertAttr(TodoEntity, item)),
      };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {string} todoId
   * @param {boolean} completed
   */
  static async update(todoId, completed) {
    const queryBuilder = new DynamoDBQueryBuilder();

    queryBuilder
      .update("todos", `completed=${completed}`)
      .where(`todoId='${todoId}'`);

    try {
      const result = await DynamoDbClientHelper.executeStatement(queryBuilder);

      return {
        statusCode: result.$metadata.httpStatusCode ?? 500,
      };
    } catch (error) {
      console.error(error);
    }
  }

  /** @param {string} todoId */
  static async delete(todoId) {
    const queryBuilder = new DynamoDBQueryBuilder();

    queryBuilder.delete().from("todos").where(`todoId='${todoId}'`);

    try {
      const result = await DynamoDbClientHelper.executeStatement(queryBuilder);

      return {
        statusCode: result.$metadata.httpStatusCode ?? 500,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
