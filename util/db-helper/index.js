//@ts-check
import {
  DynamoDBClient,
  ExecuteStatementCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBQueryBuilder } from "../query-builder/index.js";
/**
 * @typedef {import("@aws-sdk/client-dynamodb").ExecuteStatementCommandOutput} DynamoDBExecuteStatementOutput
 */

/**
 * DynamoDbClientHelper 클래스는 DynamoDB 클라이언트를 싱글톤으로 제공합니다.
 * @property {DynamoDbClientHelper} instance DynamoDbClientHelper 클래스의 단일 인스턴스
 */
export class DynamoDbClientHelper {
  /**@type {DynamoDbClientHelper} */
  static instance;

  /**
   * DynamoDbClientHelper 클래스의 생성자입니다.
   * @param {DynamoDBClient} client DynamoDB 클라이언트 인스턴스
   */
  constructor(client) {
    if (!DynamoDbClientHelper.instance) {
      DynamoDbClientHelper.instance = this;
      this.client = client;
    }

    return DynamoDbClientHelper.instance;
  }

  /**
   * 빌드된 쿼리를 실행하고 결과를 반환합니다.
   * @param {DynamoDBQueryBuilder} queryBuilder
   * @returns {Promise<DynamoDBExecuteStatementOutput>} 쿼리 실행 결과
   * @throws {Error} 쿼리 실행 중 발생한 오류
   */
  async executeStatement(queryBuilder) {
    if (!this.client) {
      throw new Error("client cannot be undefined");
    }

    const { query, parameters, limitValue } = queryBuilder;

    const command = new ExecuteStatementCommand({
      Statement: query,
      Parameters: parameters,
      Limit: limitValue,
    });

    try {
      const response = await this.client.send(command);

      return response;
    } catch (error) {
      throw new Error(
        `Error executing statement: ${error} '${query}' '${parameters}' ${limitValue}`
      );
    }
  }
}
