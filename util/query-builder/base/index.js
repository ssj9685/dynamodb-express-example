/**
 * 기본 쿼리 빌더 클래스
 */
export class BaseQueryBuilder {
  constructor() {
    this.query = "";
    this.parameters = undefined;
    this.limitValue = undefined;
  }

  /**
   * SELECT 절 추가
   * @param {string[]} fields 선택할 필드 목록
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  select(...fields) {
    if (fields.length === 0) {
      return this._addClause("SELECT *");
    }

    const selectExpression = `SELECT ${fields.join(", ")}`;
    return this._addClause(selectExpression);
  }

  /**
   * FROM 절 추가
   * @param {string} tableName 테이블 이름
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  from(tableName) {
    return this._addClause(`FROM ${tableName}`);
  }

  /**
   * WHERE 절 추가
   * @template {T}
   * @param {string} condition 조건 표현식
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  where(condition) {
    return this._addClause(`WHERE ${condition}`);
  }

  /**
   * LIMIT 절 추가
   * @param {number} limit 반환할 아이템 개수 제한
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  limit(limit) {
    this.limitValue = limit;
    return this;
  }

  /**
   * INSERT 절 추가
   * @param {object} item 추가할 아이템
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  insert(tableName, item) {
    this._addClause(`INSERT INTO ${tableName} VALUE ${JSON.stringify(item)}`);
    return this;
  }

  /**
   * UPDATE 절 추가
   * @template {T}
   * @param {object} expression 업데이트 표현식
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   */
  update(tableName, expression) {
    this._addClause(`UPDATE ${tableName} SET ${expression}`);
    return this;
  }

  delete() {
    this._addClause(`DELETE`);
    return this;
  }

  /**
   * 쿼리에 절 추가
   * @param {string} clause 추가할 절
   * @returns {BaseQueryBuilder} 자기 자신의 인스턴스
   * @private
   */
  _addClause(clause) {
    if (!this.query) {
      this.query = clause;
    } else {
      this.query += ` ${clause}`;
    }

    this.query = this.query.replace(/"/g, "'");

    return this;
  }

  /**
   * 쿼리 문자열 반환
   * @returns {string} 쿼리 문자열
   */
  build() {
    if (this.limitValue) {
      const limitExpression = `LIMIT ${this.limitValue}`;
      this.query += ` ${limitExpression}`;
    }

    return this.query;
  }
}
