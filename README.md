# Plucky Typescript API Library

## Installation

```sh
npm install plucky-js
```

```sh
yarn add plucky-js
```

## Usage

```
import { Plucky } from 'plucky-js';

const plucky = new Plucky({
  apiKey: 'your-api-key'
})
plucky.capture({
  type: "case",
  case: {
    name: "John Doe - chat 0",
    type: "chat",
    externalId: "123456",
  }
})
plucky.capture({
  type: "event",
  event: {
    name: "user sent a message",
    details: "Hello there!",
    caseExternalId: "123456",
  }
})
```
