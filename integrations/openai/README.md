# OpenAI Integration

We use OpenAI for a few things right now, all related to content generation:
- Demense generation, both for a portrait and story aspects.
- Character generation, both for a portrait and story aspects.

Soon, we will also use OpenAI for generating:
- In-character chat from Out-of-character chat
- Creation of story images based on the OOC chat generation


## General Approach

We combine a small prompt, with a call to the new Response API, backed by a vector database that is built from a set of markdown files that describe the game world.

## Important Informatino

Understand the documentation around our use of the OpenAI API calls:

* Prompt Engineering: @https://platform.openai.com/docs/guides/prompt-engineering
* The Response API: @https://platform.openai.com/docs/api-reference/responses
* Image Creation API: @https://platform.openai.com/docs/api-reference/images/create
* Using the Upload API to create File objects: @https://platform.openai.com/docs/api-reference/uploads/create
* Vector Store API: @https://platform.openai.com/docs/api-reference/vector-stores/object
* Using the Vector Store File API... @https://platform.openai.com/docs/api-reference/vector-stores-files/listFiles
* And the Vector Store Batch File API: @https://platform.openai.com/docs/api-reference/vector-stores-file-batches/createBatch


## CRITICAL

The automatic parsing of structured responses with zod is BROKEN in version 4 (at this date, sept 20 2025).  Do not upgrade to zod 4 until that bug is fixed.

## Main Features

### Cost tracking

Every one of our OpenAI API calls will console.log the token use and total cost of the API call.  We will use this information to help manage cost.

Eventually these will be piped as events to our data lake and analytics.

### ContentSmith Interface

To start, all of our OpenAI API calls will be handled through ContentSmith; think Facade pattern.  The ContentSmith will always use the Response API, backed by the file_search tool against the vector store.

For now, the ContentSmith provides the calls to generate the content for characters and demenses.  This includes:
* A call that returns a JSON object that has the game properties of a character.
* A call that returns a portrait of the character, as described by the character's game properties.

### Lore Management

`domain/lore` holds some content and utilities for the lore domain.

There is a `domain/lore/content` in the project that contains all of the markdown files that describe the game world.

There is a package.json script at the root of this repo `lore:publish` that runs a typescript script in the `domain/lore/scripts` folder.  This script overwrites the ContentSmith vectordb with the latest copy of the markdown files in domain/lore.

