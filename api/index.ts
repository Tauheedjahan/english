import app from '../server';

export default function handler(req: any, res: any) {
  // Ensure req.url is properly prefixed for Express router when rewritten by Vercel
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}
