export default {
  openapi: '3.0.0',
  info: {
    title: 'URL Shortener API',
    version: '1.0.0',
    description: 'A URL shortener API with analytics',
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:3000',
      description: 'API Server',
    },
  ],
};
