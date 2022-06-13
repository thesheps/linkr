# Architecture

This page shows at a very high level how the Admin API architecture for linkr hangs together, and how the components interact.

## System Design

```mermaid
flowchart LR
   HttpClient --POSTs new url request--> AdminApiGateway --> AdminLambda --Persists short url--> DynamoDB --> AdminLambda --> AdminApiGateway --Provides short url--> HttpClient
```

## Admin Journey - Valid URL

In this example the client has requested a short URL to be generated. The record for this path does not exist in DynamoDB already, and as such the new recorded is persisted! 🚀

```mermaid
sequenceDiagram
    actor HttpClient
    HttpClient->>Admin Api GW: Requests a URL to be shortened
    activate Admin Api GW
    Admin Api GW-->>Admin Lambda: Invokes
    activate Admin Lambda
    Admin Lambda-->>DynamoDB: Persists short url
    Admin Lambda-->>Admin Api GW: Status 200, {shortUrl:"foo"}
    deactivate Admin Lambda
    Admin Api GW-->>HttpClient: foo
    deactivate Admin Api GW
```
