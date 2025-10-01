// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../sst-env.d.ts" />

import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

// DynamoDB client
export const dynamoClient = new DynamoDBClient({});

export const ChatMessageEntity = new Entity(
  {
    model: {
      entity: "ChatMessage",
      service: "game",
      version: "1",
    },
    attributes: {
      messageId: {
        type: "string",
        required: true,
        default: () => crypto.randomUUID(),
      },
      roomId: {
        type: "string",
        required: true,
      },
      message: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      timestamp: {
        type: "string",
        required: true,
        default: () => new Date().toISOString(),
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["roomId"],
          template: "CHAT#${roomId}",
        },
        sk: {
          field: "sk",
          composite: ["timestamp", "messageId"],
          template: "MSG#${timestamp}#${messageId}",
        },
      },
      byUser: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["username"],
          template: "USER#${username}",
        },
        sk: {
          field: "gsi1sk",
          composite: ["timestamp"],
          template: "MSG#${timestamp}",
        },
      },
    },
  },
  { 
    client: dynamoClient, 
    table: Resource.GameTable.name,
  }
);