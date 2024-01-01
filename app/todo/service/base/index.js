//@ts-check
/**
 * @typedef {import("../../entity/base/index.js").AttributeType} AttributeType
 */

import { AttributeValue } from "@aws-sdk/client-dynamodb";

/**
 * @typedef {object} SchemaAttribute
 * @property {AttributeType} type - The data type of the attribute
 * @property {string[]} [values] - The possible values of the attribute (optional)
 */

/**
 * @typedef {object} Entity
 * @property {Object.<string, SchemaAttribute>} attributes - An object containing attributes
 */

export class BaseService {
  /**
   * Converts the given attributes to the desired data types.
   * @param {import("../../entity/base/index.js").Schema} schema - The data entity
   * @param {Record<string, AttributeValue>} attributes - The attributes to be converted
   * @returns {Object.<string, never>} - The converted attributes
   */
  static convertAttr(schema, attributes) {
    const convertedAttributes = Object.create(null);

    /** @type {Record<AttributeType, (value: AttributeValue) => any>} */
    const typeConverters = {
      S: (value) => value.S,
      BOOL: (value) => value.BOOL,
      B: (value) => value.B,
      NULL: () => null,
      N: (value) => parseFloat(value.N),
      L: (value) => value.L.map((item) => this.convertAttr(schema, { item })),
      M: (value) => this.convertAttr(schema, value.M),
      SS: (value) => value.SS,
      NS: (value) => value.NS.map(parseFloat),
      BS: (value) => value.BS,
    };

    for (const [key, attributeValue] of Object.entries(attributes)) {
      const { type } = schema[key];
      const converter = typeConverters[type];
      if (converter) {
        convertedAttributes[key] = converter(attributeValue);
      }
    }

    return convertedAttributes;
  }
}
