const express = require('express');
const multer = require("multer");
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const csv = require("csv-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6379'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

  const USER_CREDENTIALS = {
    username: "admin",
    password: "password123"
  };
  
  app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });
  
  // CRUD Operations

// Route to save student data
app.post('/students', async (req, res) => {
  const { id, name, age, gender, course, birthdate, phone, email, address } = req.body;
                  {/*id: '', name: '', age: '', gender: '', course: '', birthdate:'', phone:'', email:'', address: ''*/ }
  // Validate input fields
  if (!id || !name || !age || !gender || !course || !birthdate || !phone || !email || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Set student data in Redis (using object syntax for Redis v4 and above)
    const studentData = { name, age, gender, course, birthdate, phone, email, address };

    // Save student data in Redis hash
    await client.hSet(`student:${id}`, 'name', studentData.name);
    await client.hSet(`student:${id}`, 'age', studentData.age);
    await client.hSet(`student:${id}`, 'gender', studentData.gender);
    await client.hSet(`student:${id}`, 'course', studentData.course);
    await client.hSet(`student:${id}`, 'birthdate', studentData.birthdate);
    await client.hSet(`student:${id}`, 'phone', studentData.phone);
    await client.hSet(`student:${id}`, 'email', studentData.email);
    await client.hSet(`student:${id}`, 'address', studentData.address);

    // Respond with success message
    res.status(201).json({ message: 'Student saved successfully' });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ message: 'Failed to save student' });
  }
});

// Read (R)
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  const student = await client.hGetAll(`student:${id}`);
  if (Object.keys(student).length === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// Read all students
app.get('/students', async (req, res) => {
  const keys = await client.keys('student:*');
  const students = await Promise.all(keys.map(async (key) => {
    return { id: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));
  res.json(students);
});

// Update (U)
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const { name, age, gender, course, birthdate, phone, email, address } = req.body;

  if (!name && !age && !gender && !course && !birthdate &&  !phone && !email && !address) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingStudent = await client.hGetAll(`student:${id}`);
    if (Object.keys(existingStudent).length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update student data in Redis
    if (name) await client.hSet(`student:${id}`, 'name', name);
    if (age) await client.hSet(`student:${id}`, 'age', age);
    if (gender) await client.hSet(`student:${id}`, 'gender', gender);
    if (course) await client.hSet(`student:${id}`, 'course', course);
    if (birthdate) await client.hSet(`student:${id}`, 'birthdate', birthdate);
    if (phone) await client.hSet(`student:${id}`, 'phone', phone);
    if (email) await client.hSet(`student:${id}`, 'email', email);
    if (address) await client.hSet(`student:${id}`, 'address', address);

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Failed to update student' });
  }
});

// Delete (D)
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  await client.del(`student:${id}`);
  res.status(200).json({ message: 'Student deleted successfully' });
});

app.post("/logout", (req, res) => {
  // In a real-world scenario, you would destroy a session or invalidate a token.
  return res.json({ success: true, message: "Logged out successfully" });
})
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});