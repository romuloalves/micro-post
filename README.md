# micro-post

> Package to only accept POST request for microservices built with [Micro](https://github.com/zeit/micro).

[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## About

When developing a microservice with Nodejs and [zeit](https://github.com/zeit)/[micro](https://github.com/zeit/micro) you may want to accept only POST methods.
`micro-post` is a simple package that allows you to achieve this with a lot of simplicity.

Just encapsulating your existing function in the `micro-post` default exported function will automatically validate the requests, include the `Access-Control-Request-Method` and status code in the response header, and response body with `Method Not Allowed`.

The package allows you to modify it's response code, plain text, change the response by a JSON or even execute a function to manage the request by your own. You can find how to do that in the examples section.


## Installation

Install using [npm](https://www.npmjs.com/):
```
npm install --save micro-post
```

Install using [yarn](https://yarnpkg.com/en/):
```
yarn add micro-post
```

## Usage

### Basic

This is the basic usage. When a non-POST request is received, the response will be `405 – Method Not Allowed`.

```js
const post = require('micro-post')

module.exports = post(async (req, res) => {
  return `It's a POST request!`
})
```

### With options

You can parameterize some different responses like other messages, JSON and even a function to manage the request by your own.

```js
const post = require('micro-post')

const options = {
  errorCode: 404,
  response: 'My custom response',
  contentType: 'text/plain'
}

module.exports = post(options, async (req, res) => {
  return `It's a POST request!`
})
```

## Examples

*Each example has its own README explaining how to execute it.*

### All default options: <a href="./example/default">default</a>

Example that use the default options of the package.

URL: [https://micro-post-example-default.now.sh](https://micro-post-example-default.now.sh)


### Custom Message: <a href="./examples/custom-message">custom-message</a>

The response is a custom message `Changing the default message is simple as breathe` with content-type `text/plain`.

URL: [https://micro-post-example-custom-message.now.sh](https://micro-post-example-custom-message.now.sh)


### Custom JSON: <a href="./example/custom-json">custom-json</a>

The response is a custom JSON  with content-type `application/json`.

URL: [https://micro-post-example-custom-json.now.sh](https://micro-post-example-custom-json.now.sh)

*The package change automatically the content-type to `application/json` in case your `response` property in the options parameter is an object.*

```js
{
  error: {
    message: 'Invalid method'
  }
}
```


### Custom HTML: <a href="./example/custom-html">custom-html</a>

The response is a custom HTML  with content-type `text/html`.

URL: [https://micro-post-example-custom-html.now.sh](https://micro-post-example-custom-html.now.sh)


### Custom Function: <a href="./example/custom-function">custom-function</a>

Before the response ends, the function that receives the `request` and the `response` from HTTP is called.

URL: [https://micro-post-example-custom-function.now.sh](https://micro-post-example-custom-function.now.sh)


## Developing/Contributing

*Feel free to open issues and create PRs! :)*

This package is linted by [XO](https://github.com/sindresorhus/xo) and tested by [AVA](https://github.com/avajs/ava).

After install the dependencies you can execute `npm test`, that will test different responses. Each test creates its [Micro](https://github.com/zeit/micro) instance to simulate a real environment.


## License

MIT License

Copyright (c) 2016 Rômulo Alves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
