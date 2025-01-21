// import all models
const {
  Book: BooksModel,
  ReadingList: ReadingListsModel,
  User: UsersModel,
} = require("../models");


function validateUserAndEmail(data) {
  const errors = []
  if (!data.username) {
      errors.push('username is required!')
  }
  if (!data.email) {
      errors.push('email is required!')
  }
  return errors;

}

function validateBooks(data) {
  const errors = []
  if (!data.title) {
      errors.push('book title is required!')
  }
  if (!data.author) {
      errors.push('author is required!')
  }
  if (!data.genre) {
      errors.push('genre is required!')
  }
  if (!data.publicationYear) {
      errors.push('publication year is required!')
  }

  return errors
}


const createUser = async (req, res) => {
  const { username, email } = req.body

  const errors = validateUserAndEmail(req.body)
  if (errors.length > 0) return res.status(400).json({ errors })


  try {
      const checkUser = await UsersModel.findAll({ where: { email: email } })

      if (checkUser.length > 0) return res.status(400).json({ message: "email already exists!" })
      const newUser = await UsersModel.create({ username: username, email: email })

      res
          .status(201)
          .json({ message: "User created successfully", user: newUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user!" });
  }
}

const addBooks = async (req, res) => {

  const { title, author, genre, publicationYear } = req.body
  const errors = validateBooks(req.body)
  if (errors.length > 0) return res.status(400).json({ errors })

  try {
      const newBook = await BooksModel.create({ title: title, author: author, genre: genre, publicationYear: publicationYear })
      res
          .status(201)
          .json({ message: "Book added successfully", book: newBook });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create books!" });
  }
}

function validateSearchBooks(title, author) {
  const errors = []
  if (!title) {
      errors.push('book title is required!')
  }
  if (!author) {
      errors.push('author is required!')
  }
  return errors
}

const searchBooks = async (req, res) => {
  const title = req.query.title
  const author = req.query.author
  const errors = validateSearchBooks(title, author)
  if (errors.length > 0) return res.status(400).json({ errors })

  try {
      const fetchBook = await BooksModel.findAll({ where: { title: title, author: author } })
      if (fetchBook.length===0) return res.status(404).json({ message: "No books found" })

      res
          .status(200)
          .json({ books: fetchBook });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch books!" });
  }
}



const addToReadingList = async (req, res) => {
  try {
      const { userId, bookId, status } = req.body

      const user = await UsersModel.findByPk(userId)
      const book = await BooksModel.findByPk(bookId)

      if (!user || !book) return res.status(400).json({ message: "Invalid user or book ID!" })
      

      const readingList = await ReadingListsModel.create({ userId: userId, bookId: bookId, status: status })

      res
          .status(200)
          .json({message:"Book added to reading list",readingList: readingList });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch ReadingList!" });
  }

}

const updateBook= async (req,res)=>{
  try{
      const {title,genre}=req.body 
      const bookId=req.params.bookId
      if(!title || !genre) return res.status(400).json({message:"title and genre is required!"})
      
      const book=await BooksModel.findByPk(bookId)

      if(!book) return res.status(404).json({message:"Book not found!"})
      
      book.title=title || book.title 
      book.genre=genre || book.genre 

      await book.save()
      
      res
      .status(200)
      .json({message:"Book details updated successfully!",book: book });
      
      
  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Failed to update book!" });
  }
}

const getUserByReadingList=async (req,res)=>{
  try{
      const userId=req.params.userId 

      const userReadingList=await ReadingListsModel.findAll({where:{
          userId:userId
      }})

      if(!userReadingList) return res.status(404).json({message:"User not found or no books in reading list"})

          res
          .status(200)
          .json({readingList: userReadingList });
          

  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user reading list!" });
  }
}

const removeBookFromReadingList=async (req,res)=>{
  try{
      const readingListId=req.params.readingListId

      console.log(readingListId)

      if(!readingListId) return res.status(400).json({message:"Reading list id is required!"})
      
      const readingList=await ReadingListsModel.findByPk(readingListId)
      if(!readingList) {return res.status(400).json({message:"readingList id doesn't exists!"})}
      
     else{await readingList.destroy()
      res
      .status(200)
      .json({message:"Book removed from reading list!" });}
      

  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Failed to remove book from reading list!" });
  }
}

module.exports = { createUser, addBooks,searchBooks ,addToReadingList,updateBook,getUserByReadingList,removeBookFromReadingList}