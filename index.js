const express = require('express');
const { PermifyConfiguration } = require('./permify'); // Import PermifyConfiguration
const checkPermissions = require('./auth'); // Import the checkPermissions middleware

// Initialize Permify Configuration
new PermifyConfiguration();

const app = express();

// Custom middleware to populate userInfo
app.use((req, res, next) => {
  req.userInfo = {
    id: req.params.id, // Assume ID from request params, adjust as needed
  };
  next();
});

// Define routes
app.get('/projects/:id', checkPermissions('project', 'read'), (req, res) => {
  if (req.authorized === 'authorized') {
    res.send('You have access to this project route');
  } else {
    res.status(403).send('You are not authorized to access this project');
  }
});

app.get('/tasks/:id', checkPermissions('task', 'update'), (req, res) => {
  if (req.authorized === 'authorized') {
    res.send('You have access to this task route');
  } else {
    res.status(403).send('You are not authorized to access this task');
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
