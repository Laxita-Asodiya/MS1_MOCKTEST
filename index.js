const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const app = express();

const { createUser, addBooks,searchBooks ,addToReadingList,updateBook,getUserByReadingList,removeBookFromReadingList}=require('./controllers/dataControllers')

app.use(express.json());
app.use(cors());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Unable to connect to database", error);
  });


//   Routes

app.post('/api/users',createUser)
app.post('/api/books',addBooks)

app.get('/api/books/search',searchBooks)
app.post('/api/reading-list',addToReadingList)
app.post('/api/books/:bookId',updateBook)
app.get('/api/reading-list/:userId',getUserByReadingList)
app.post('/api/reading-list/:readingListId',removeBookFromReadingList)



app.listen(3000, () => {
  console.log("server is running on port 3000");
});

module.exports={app}