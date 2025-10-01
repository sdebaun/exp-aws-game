// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../../sst-env.d.ts" />

import { Entity, EntityItem } from "electrodb";
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Create DynamoDB client
const dynamoClient = new DynamoDBClient({});

// Connection tracking entity
export const ConnectionEntity = new Entity(
  {
    model: {
      entity: "Connection",
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
          template: "CONN#${connectionId}",
        },
        sk: {
          field: "sk",
          composite: [],
          template: "METADATA",
        },
      },
      byRoom: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["roomId"],
          template: "ROOM#${roomId}",
        },
        sk: {
          field: "gsi1sk",
          composite: ["connectionId"],
          template: "CONN#${connectionId}",
        },
      },
    },
  },
  {
    client: dynamoClient,
    table: Resource.GameTable.name,
  }
);

export type Connection = EntityItem<typeof ConnectionEntity>;