import express from 'express';
import permifyConfiguration from './permify';
import { authorize } from './authorize';

const app = express();
app.use(express.json());

// Sample middleware to simulate user authentication
// In a real-world application, replace this with actual authentication logic
app.use((req, res, next) => {
    // Simulate a logged-in user by setting req.user
    req.user = {
        id: 'alice',  // Replace with dynamic user ID from authentication
        roles: ['admin']  // Replace with dynamic roles based on user data
    };
    next();
});

new permifyConfiguration();

// Example: Organization routes
app.post('/organization', authorize('organization', 'add_employee'), (req, res) => {
    res.status(201).json({ message: 'Employee added to organization successfully!' });
});

app.get('/organization/:id', authorize('organization', 'read'), (req, res) => {
    const orgId = req.params.id;
    res.status(200).json({ message: `Details of organization ${orgId}` });
});

app.delete('/organization/:id', authorize('organization', 'delete'), (req, res) => {
    const orgId = req.params.id;
    res.status(200).json({ message: `Organization ${orgId} deleted successfully` });
});

// Example: Team routes
app.post('/team', authorize('team', 'create'), (req, res) => {
    res.status(201).json({ message: 'Team created successfully!' });
});

app.put('/team/:id', authorize('team', 'update'), (req, res) => {
    const teamId = req.params.id;
    res.status(200).json({ message: `Team ${teamId} updated successfully!` });
});

app.delete('/team/:id', authorize('team', 'delete'), (req, res) => {
    const teamId = req.params.id;
    res.status(200).json({ message: `Team ${teamId} deleted successfully!` });
});

app.listen(3002, () => {
    console.log(`Server started at port ${3002}`);
});
