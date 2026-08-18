import app from '../../../artifacts/api-server/src/app';

export default function handler(req, res) {
  // Forward all requests to the Express app
  return app(req, res);
}
