const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT =3000;

app.use(bodyParser.json());

const DB_URI = 'mongodb+srv://kausstubhytmed:CiWJhJZaJiArsi5u@cluster0.llvnzuc.mongodb.net/Hire-Quotient?retryWrites=true&w=majority'


mongoose.connect(DB_URI)
.then(() => {
    console.log('Connected to the database');
})
.catch((error) => {
    console.error('Error connecting to the database:', error.message);
});


// Load routes
const userRoutes = require('./routes/userRoute');
const postRoutes = require('./routes/postRoute');


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
