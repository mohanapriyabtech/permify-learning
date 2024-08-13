// middleware.js

import * as permify from '@permify/permify-node';

const client = new permify.grpc.newClient({ endpoint: 'localhost:3478' });

export const authorize = (action) => async (req, res, next) => {
    const userId = req.user; // Ensure this is set correctly in your request handling
    console.log(userId,"userId")
    const resourceId = req.query.orgId || req.params.id; // Adjust as needed for your resource identifier

    try {
        // Construct the query for Permify
        const query = {
            tenantId: 'tenant1',  // Adjust this as needed
            query: {
                entity: {
                    type: 'user',
                    id: userId
                },
                relation: action,
                target: {
                    type: 'organization',
                    id: resourceId
                }
            }
        };

        // Check permissions using Permify
        const result = await client.data.read(query);

        // Check if access is granted
        if (result.length > 0) {
            next(); // User has access
        } else {
            res.status(403).json({ status_code: 403, status: false, message: 'Access denied' });
        }
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(500).json({ status_code: 500, status: false, message: 'Internal server error' });
    }
};