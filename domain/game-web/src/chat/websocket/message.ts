import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { z } from "zod";
import { ulid } from "ulid";
import { ConnectionEntity } from "./entities";
import { ChatMessageEntity } from "../entity";

// Domain errors -----------------------------------------------------------
class BadRequest extends Error {}
class Forbidden extends Error {}
class Internal extends Error {}

const toHttp = (e: unknown): APIGatewayProxyResult =>
  e instanceof BadRequest
    ? { statusCode: 400, body: e.message }
    : e instanceof Forbidden
    ? { statusCode: 403, body: e.message }
    : {
      statusCode: 500,
      body: e instanceof Error ? e.message : "Internal error",
    };

// Schema ------------------------------------------------------------------
const SendMessage = z.object({
  action: z.literal("sendMessage"),
  message: z.string().min(1),
});

type SendMessage = z.infer<typeof SendMessage>;

// Steps -------------------------------------------------------------------
const getConnection = (connectionId: string) =>
  pipe(
    TE.tryCatch(
      () => ConnectionEntity.get({ connectionId }).go(),
      () => new Internal("Failed to load connection"),
    ),
    TE.chain((res) =>
      res?.data
        ? TE.right(res.data)
        : TE.left(new Forbidden("Connection not found"))
    ),
  );

const parseSendMessage = (raw: string) =>
  pipe(
    E.tryCatch(() => JSON.parse(raw), () => new BadRequest("Invalid JSON")),
    E.chain((json) => {
      const r = SendMessage.safeParse(json);
      return r.success
        ? E.right(r.data)
        : E.left(new BadRequest(r.error.message));
    }),
  );

const persistMessage = (
  args: { roomId: string; username: string; message: string },
) =>
  TE.tryCatch(
    () =>
      ChatMessageEntity.create({
        messageId: ulid(),
        roomId: args.roomId,
        username: args.username,
        message: args.message,
        timestamp: new Date().toISOString(),
      }).go(),
    () => new Internal("Failed to persist message"),
  );

// Handler -----------------------------------------------------------------
export const handler: APIGatewayProxyHandler = async (event) =>
  pipe(
    TE.right(event),
    TE.bindTo("event"),
    TE.bind("conn", ({ event }) =>
      pipe(
        O.fromNullable(event.requestContext.connectionId),
        E.fromOption(() => new BadRequest("Missing connectionId")),
        TE.fromEither,
        TE.chain(getConnection),
      )),
    TE.bind("cmd", ({ event }) =>
      pipe(
        O.fromNullable(event.body),
        E.fromOption(() => new BadRequest("No message body")),
        E.chain(parseSendMessage),
        TE.fromEither,
      )),
    TE.chain(({ conn, cmd }) =>
      persistMessage({
        roomId: conn.roomId,
        username: conn.username,
        message: cmd.message,
      })
    ),
    TE.match(toHttp, () => ({ statusCode: 200, body: "Message sent" })),
  )();
