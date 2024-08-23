const { client } = require('./permify'); // Import the Permify client

const checkPermissions = (entityType, action) => {
  return async (req, res, next) => {
    try {
      // Extract entity ID and user ID from request
      const entityId = req.params.id; // Route parameter for the entity (e.g., project ID)
      const userId = req.userInfo?.id; // User ID from custom middleware

      // Validate entity ID and user ID
      if (!entityId || !userId) {
        return res.status(400).send('Entity ID or User ID is missing in the request parameters');
      }

      // Validate that userId matches the required pattern
      const validIdPattern = /^[a-zA-Z0-9_\-@.:+]{1,128}$/;
      if (!validIdPattern.test(userId)) {
        return res.status(400).send('User ID does not match the required format');
      }

      // Prepare metadata for the permission check
      const metadata = {
        schemaVersion: '1',  // Ensure this matches your schema version
        snapToken: '',       // Provide a valid snapshot token if needed
        depth: 20,           // Adjust depth as needed
      };

      // Perform permission check with Permify
      const checkRes = await client.permission.check({
        tenantId: 't1',
        metadata: metadata,
        entity: {
          type: entityType,  // 'project', 'task', etc.
          id: entityId,
        },
        permission: action, // 'read', 'update', etc.
        subject: {
          type: 'user',
          id: userId,  // Use the validated user ID
        },
      });

      // Handle permission check result
      if (checkRes.can === 1) {
        req.authorized = 'authorized';
        next();
      } else {
        req.authorized = 'not authorized';
        res.status(403).send('You are not authorized to access this resource');
      }
    } catch (err) {
      console.error('Error checking permissions:', err.message);
      res.status(500).send('Internal server error');
    }
  };
};

module.exports = checkPermissions;



module.exports = checkPermissions;
