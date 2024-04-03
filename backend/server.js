// Import necessary modules
const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const socketio = require("socket.io");
// Import extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
// const rateLimiter = require("express-rate-limit");

// Set up rate limiter
app.set("trust proxy", 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

// Set up middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({ crossOriginResourcePolicy: false }));

// Import error handler middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Set up routes middleware
readdirSync("./routes").map((r) =>
  app.use("/api/v1", require(`./routes/${r}`))
);

// Define a route for the root
app.get("/", (req, res) => {
  res.send("server is running");
});

// Import database connection function
const connectDB = require("./db/connect");

// Set up error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Define the port
const port = process.env.PORT || 3000;

// Start the server
const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI);

    
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

let server=app.listen(port, () =>
console.log(`Server is listening on port ${port}...`)
);
// Create the socket server
const io = socketio(server,{
  pingTimeout: 60000,
  cors: {
      origin: ['http://localhost:5173'],
      // credentials: true,
  },
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('socket connected');
  
 socket.on('todoCreated', (newTodo) => {
    io.emit(`todoCreated:${newTodo.user}`, newTodo);
  });

  socket.on('todoDeleted', (id, userId) => {
    io.emit(`todoDeleted:${userId}`, id);
  }
  );

  socket.on('todoCompleted', (updatedTodo) => {
    io.emit(`todoCompleted:${updatedTodo.user}`, updatedTodo);
  }
  );
  socket.on('todoUpdated', (updatedTodo) => {
    io.emit(`todoUpdated:${updatedTodo.user}`, updatedTodo);
  }
  );

  socket.on('disconnect', () => {
    console.log('socket disconnected');
  });
});
// Call the start function
start();

// Export io so it can be used in other parts of the application
module.exports = { io, server };
