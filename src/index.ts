import { ServerResponse, IncomingMessage } from "http";
import { RequestHandler } from "micro";

type MicroRequestHandlerResponse = ReturnType<RequestHandler>;

export type ResponseChainHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function
) => undefined;

type ResponseHandlerParameter = ResponseChainHandler | RequestHandler;
type ResponseParameter = MicroRequestHandlerResponse | ResponseHandlerParameter;

type Parameters = {
  errorCode?: number;
  response?: ResponseParameter;
  contentType?: string;
};

const ALLOWED_HTTP_METHOD = "POST";

const isValidHandler = (
  response: ResponseParameter
): response is ResponseHandlerParameter => {
  if (typeof response === "function") {
    return true;
  }

  return false;
};

const isResponseChainHandler = (
  response: ResponseParameter
): response is ResponseChainHandler => {
  if (isValidHandler(response)) {
    // is ResponseChainHandler, this one must have three (3) arguments
    if (response.length === 3) {
      return true;
    }
  }

  return false;
};

const isRequestHandler = (
  response: ResponseParameter
): response is RequestHandler => {
  if (isValidHandler(response) && !isResponseChainHandler(response)) {
    return true;
  }

  return false;
};

function post(fn: RequestHandler): RequestHandler;
function post(params: Parameters, fn: RequestHandler): RequestHandler;
function post(
  paramsOrRequestHandler: Parameters | RequestHandler,
  fn?: RequestHandler
): RequestHandler {
  let params: Parameters = {};
  let handler: RequestHandler;

  // decide overloaded argument assignments
  if (!fn && typeof paramsOrRequestHandler === "function") {
    handler = paramsOrRequestHandler;
  } else if (fn && typeof paramsOrRequestHandler === "object") {
    params = paramsOrRequestHandler;
    handler = fn;
  } else {
    throw new Error(
      "You must either provide just the `fn` or both the `params` and `fn` arguments."
    );
  }

  // Get custom code and content or defaults
  const { errorCode = 405 } = params;

  // Get custom response of default
  let { response = "Method Not Allowed" } = params;

  return (req, res) => {
    res.setHeader("Access-Control-Request-Method", ALLOWED_HTTP_METHOD);
    const { method } = req;
    if (method != ALLOWED_HTTP_METHOD) {
      res.statusCode = errorCode;
      if (isResponseChainHandler(response)) {
        // Execute custom response of function type
        return response(req, res, () => {
          res.end();
        });
      } else if (isRequestHandler(response)) {
        return response(req, res);
      }

      // stay backwards compatible
      if (params.contentType || typeof response === "string") {
        res.setHeader("Content-Type", params.contentType || "text/plain");
      }

      return response;
    }

    return handler(req, res);
  };
}

// typescript/es6 compatible default export
export default post;

// backward compatible (nodejs require) exports
module.exports = exports = post;
