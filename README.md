# App Error

Make application errors easier to handle

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
  - [`httpStatusCode`](#httpstatuscode)
  - [`code`](#code)
  - [`level`](#level)
  - [`meta`](#meta)
- [License](#license)

## Installation

``` bash
npm install @guilhermemj/app-error
```

## Usage

Simply throw an `AppError` like you would with any normal `Error`. You can, however, pass a second argument with some options to customize error context and meta info.

``` javascript
var AppError = require("@guilhermemj/app-error");

// Basic usage
throw new AppError("Ops, something went wrong!");

throw new AppError("Resource not found!", {
  httpStatusCode: 404,
  code: "ERR_NOT_FOUND",
});

// Full customization
throw new AppError("Resource version differs from database", {
  httpStatusCode: 409,
  code: "ERR_RESOURCE_CONFLICT",
  level: "warn",
  meta: {
    user: "@johndoe",
    resourceId: "123456",
    informedData: {/* ... */},
    expectedData: {/* ... */},
  },
});
```

Where `AppError` really shines is when catching and handling thrown errors. Besides the mentioned options, each error has an unique `id` and `date` object making it very easy to log errors and normalize API responses.

Here, we simulate an express controller response with a totally arbitrary logger function to show the difference between handling an `AppError` and other common errors:

``` javascript
var AppError = require("@guilhermemj/app-error");

try {
  // Do some code...
} catch (error) {
  if (error instanceof AppError) {
    logger[error.level](error.message, error.code, {
      // `meta` may have important info about error context
      meta: error.meta,
      date: error.date,
      uuid: error.id,
    });

    res.status(error.httpStatusCode).json({
      message: error.message,
      code: error.code,
      uuid: error.id,
    });
  } else {
    // Something REALLY bad happened! But we only have a message to log :(
    logger.error(error.message, "ERR_INTERNAL_ERROR", { date: new Date() });

    res.status(500).json({
      message: error.message,
      code: "ERR_INTERNAL_ERROR",
    });
  }
}
```

Please note how we are able to log much richier information with `AppError` and how easy it is to identify it's instances.

## Options

### `httpStatusCode`

- **Type:** `number`
- **Default:** `500`

Status code to be used on API responses. ([List of existing codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status))

### `code`

- **Type:** `string`
- **Default:** `"ERR_UNCAUGHT_EXCEPTION"`

Error code. Can be used to identify errors of the same type.

### `level`

- **Type:** `"error" | "warn" | "info" | "debug"`
- **Default:** `"error"`

Error severity level. Useful for logging.

### `meta`

- **Type:** `Object`
- **Default:** `{}`

Extra info about the error to be retrieved later.

It's very common to enrich logs and API responses with some execution context. This is where you should store it.

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
