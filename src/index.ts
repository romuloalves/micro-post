import { ServerResponse, IncomingMessage } from "http";
import { RequestHandler } from "micro";

type ResponseChainHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function
) => any;

type Parameters = {
  errorCode?: number;
  response?: string | object | ResponseChainHandler;
  contentType?: string;
};

const ALLOWED_HTTP_METHOD = "POST";

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
    throw new Error("You must either provide just the `fn` or both the `params` and `fn` arguments.");
  }

  // Get custom code and content or defaults
  const { errorCode = 405 } = params;

  // Get custom response of default
  let { response = "Method Not Allowed", contentType = "text/plain" } = params;

  if (typeof response === "object") {
    response = JSON.stringify(response);
    contentType = "application/json";
  }

  const contentLength = Buffer.byteLength(response.toString());

  return (req, res) => {
    res.setHeader("Access-Control-Request-Method", ALLOWED_HTTP_METHOD);
    const { method } = req;
    if (method != ALLOWED_HTTP_METHOD) {
      res.statusCode = errorCode;
      if (typeof response === "function") {
        // Execute custom response of function type
        return (<ResponseChainHandler>response)(req, res, () => {
          res.end();
        });
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", contentLength);
      res.write(response);
      
      res.end();
      return;
    }

    return handler(req, res);
  };
}

export = post
