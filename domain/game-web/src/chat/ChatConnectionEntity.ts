// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../sst-env.d.ts" />

import { Entity, EntityItem } from "electrodb";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Create DynamoDB client
const dynamoClient = new DynamoDBClient({});

// Connection tracking entity
export const ChatConnectionEntity = new Entity(
  {
    model: {
      entity: "ChatConnection",
      version: "1",
      service: "chat",
    },
    attributes: {
      connectionId: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      roomId: {
        type: "string",
        required: true,
      },
      connectedAt: {
        type: "number",
        required: true,
      },
    },
    indexes: {
      byConnection: {
        pk: {
          field: "pk",
          composite: ["connectionId"],
        },
        sk: {
          field: "sk",
          // composite: ["connectedAt"],
          composite: [],
          template: "LOOKUP",
        },
      },
      byRoom: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["roomId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["connectionId"],
        },
      },
    },
  },
  {
    client: dynamoClient,
    table: Resource.GameTable.name,
  },
);

export type ConnectionEntityItem = EntityItem<typeof ChatConnectionEntity>;
