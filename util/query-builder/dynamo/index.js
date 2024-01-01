import { BaseQueryBuilder } from "../base/index.js";

/**
 * DynamoDBQueryBuilder 클래스는 DynamoDB 쿼리를 빌드하고 실행하는 기능을 제공합니다.
 * @typedef {import("./index.js").DynamoDBQueryBuilder} DynamoDBQueryBuilder
 * @property {DynamoDBQueryBuilder} instance DynamoDBQueryBuilder 클래스의 단일 인스턴스
 */
export class DynamoDBQueryBuilder extends BaseQueryBuilder {
  constructor() {
    super();
  }
}
