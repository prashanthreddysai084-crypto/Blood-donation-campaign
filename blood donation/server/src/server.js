const app = require('./app');
const connectDB = require('./config/database');
const { PORT, NODE_ENV } = require('./config/env');

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Blood Donation Backend Server is running!`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    console.log('\n[Server] Received termination signal. Closing HTTP server gracefully...');
    server.close(() => {
      console.log('[Server] HTTP server closed. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
