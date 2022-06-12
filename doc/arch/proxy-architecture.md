# Architecture

This page shows at a very high level how the proxy architecture for linkr hangs together, and how the components interact.

## System Design

```mermaid
flowchart LR
   Browser --Requests URL--> ProxyApiGateway --> ProxyLambda --Validates URL--> DynamoDB --> ProxyLambda --Provides Path--> ProxyApiGateway --Redirects User--> Browser
```

## Proxy Journey - Valid URL

In this example the user has requested a legit URL which has been shortened using the admin API. The record for this path exists in DynamoDB already, and as such the user is able to be redirected to the upstream! 🚀

```mermaid
sequenceDiagram
    actor Browser
    Browser->>Proxy Api GW: Requests shortened URL
    activate Proxy Api GW
    Proxy Api GW-->>Proxy Lambda: Invokes
    activate Proxy Lambda
    Proxy Lambda-->>DynamoDB: Checks URL is valid
    DynamoDB-->>Proxy Lambda: Record exists!
    Proxy Lambda-->>Proxy Api GW: Status 301 - Redirect
    deactivate Proxy Lambda
    Proxy Api GW-->>Browser: foo
    deactivate Proxy Api GW
```

## Proxy Journey - Invalid URL

In this example the user has requested a nonsense URL has either been mashed into the browser incorrectly or is otherwise malformed. Here, the user gets a 404 error page telling them what a _horrible person_ they are 😞

```mermaid
sequenceDiagram
    actor Browser
    Browser->>Proxy Api GW: Requests shortened URL
    activate Proxy Api GW
    Proxy Api GW-->>Proxy Lambda: Invokes
    activate Proxy Lambda
    Proxy Lambda-->>DynamoDB: Checks URL is valid
    DynamoDB-->>Proxy Lambda: Record is invalid!
    Proxy Lambda-->>Proxy Api GW: Status 404
    deactivate Proxy Lambda
    Proxy Api GW-->>Browser: foo
    deactivate Proxy Api GW
```
