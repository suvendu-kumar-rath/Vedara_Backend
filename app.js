const express = require('express');
const sequelize = require ('./config/db');
require("dotenv").config();
require('./models');
const sendResponse = require ('./middlewares/response.middleware');
const handleNotFound = require ('./middlewares/notFound.middleware');
const errorHandler = require ('./middlewares/errorHandler.middleware');
const adminRoutes = require ('./routes/admin.routes');

const app = express();
const port = process.env.APP_PORT;
const baseUrl = process.env.BASE_URL;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(sendResponse);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.use("/api/admin", adminRoutes);

// 404 Not Found middleware - MUST be after all routes
app.use(handleNotFound);

// Error handling middleware - MUST be last
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection establish successfully");
    await sequelize.sync({ alter: false });
    console.log('All models were synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server running at : ${baseUrl}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
