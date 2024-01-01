//@ts-check
/**
 * @typedef {'S' | 'N' | 'BOOL' | 'B' | 'NULL' | 'L' | 'M' | 'SS' | 'NS' | 'BS'} AttributeType
 */

/**
 * @typedef {object} SchemaAttribute
 * @property {AttributeType} type - The data type of the attribute
 * @property {string[]} [values] - Possible values of the attribute (optional)
 */

/**
 * @typedef {Record<string, SchemaAttribute>} Schema
 */

/**
 * Entity class.
 */
export class Entity {
  /**
   * Creates a schema for the entity.
   * @param {Object.<string, SchemaAttribute>} attributes - The attribute values of the entity
   * @returns {Schema} - The created schema object
   */
  static createSchema(attributes) {
    return attributes;
  }

  /**
   * Returns the data type of the given value.
   * @param {*} value - The value
   * @returns {AttributeType | null} - The data type, or null if the type is not supported
   */
  static getAttributeType(value) {
    if (typeof value === "string") {
      return "S";
    }
    if (typeof value === "number") {
      return "N";
    }
    if (typeof value === "boolean") {
      return "BOOL";
    }
    if (Buffer.isBuffer(value)) {
      return "B";
    }
    if (value === null) {
      return "NULL";
    }
    if (Array.isArray(value)) {
      return Entity.getArrayType(value);
    }
    if (typeof value === "object") {
      return "M";
    }
    return null;
  }

  /**
   * Returns the data type of the given array.
   * @param {Array} array - The array
   * @returns {AttributeType | null} - The data type, or null if the type is not supported
   */
  static getArrayType(array) {
    if (array.every((value) => typeof value === "string")) {
      return "SS";
    }
    if (array.every((value) => typeof value === "number")) {
      return "NS";
    }
    if (array.every((value) => Buffer.isBuffer(value))) {
      return "BS";
    }
    return "L";
  }

  /**
   * Checks if the given attribute value matches the specified type.
   * @param {*} attributeValue - The attribute value
   * @param {AttributeType} attributeType - The type
   * @returns {boolean} - True if the type matches, false otherwise
   */
  static isAttributeTypeValid(attributeValue, attributeType) {
    switch (attributeType) {
      case "S":
        return typeof attributeValue === "string";
      case "N":
        return typeof attributeValue === "number";
      case "BOOL":
        return typeof attributeValue === "boolean";
      case "B":
        return Buffer.isBuffer(attributeValue);
      case "NULL":
        return attributeValue === null;
      case "L":
        return Array.isArray(attributeValue);
      case "M":
        return typeof attributeValue === "object";
      case "SS":
        return (
          Array.isArray(attributeValue) &&
          attributeValue.every((value) => typeof value === "string")
        );
      case "NS":
        return (
          Array.isArray(attributeValue) &&
          attributeValue.every((value) => typeof value === "number")
        );
      case "BS":
        return (
          Array.isArray(attributeValue) &&
          attributeValue.every((value) => Buffer.isBuffer(value))
        );
      default:
        return false;
    }
  }
}
