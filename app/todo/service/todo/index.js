//@ts-check
import { DynamoDbClientHelper } from "../../../../util/db-helper/index.js";
import { DynamoDBQueryBuilder } from "../../../../util/query-builder/index.js";
import todo from "../../entity/todo/index.js";
import { BaseService } from "../base/index.js";

export class TodoService extends BaseService {
  static async getItems() {
    const helper = DynamoDbClientHelper.instance;

    const queryBuilder = new DynamoDBQueryBuilder();

    queryBuilder.select().from("todos");

    try {
      const todos = await helper.executeStatement(queryBuilder);

      return {
        statusCode: todos.$metadata.httpStatusCode ?? 500,
        totalCount: todos.Items?.length,
        items: todos.Items?.map((item) => super.convertAttr(todo, item)),
      };
    } catch (error) {
      console.error(error);
    }
  }
}
