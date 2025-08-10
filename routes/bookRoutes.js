import express from "express";
import { addBook, addManyBooks, countBooks, deleteBookById, deleteBookByTitle, deleteBooks, deleteBooksByAuthor, getBookById, getBooks, searchBooks, updateBookAuthorById, updateBookAvailableCopiesById, updateBookById, updateBookGenreById, updateBookTitleById } from "../controllers/bookController.js";

const bookRoute=express.Router();

bookRoute.get("/",getBooks);
bookRoute.post("/",addBook)
bookRoute.post("/addManyBooks",addManyBooks)
bookRoute.get("/search",searchBooks)
bookRoute.delete("/delete/:id",deleteBookById)
bookRoute.delete("/delete",deleteBooks)
bookRoute.put("/update/:id",updateBookById)
bookRoute.get("/count",countBooks)
bookRoute.get("/:id",getBookById)
bookRoute.delete("/deleteBookByTitle/:title",deleteBookByTitle)
bookRoute.delete("/deleteBookByAuthor/:author",deleteBooksByAuthor)
bookRoute.patch("/updateBookTitle/:id",updateBookTitleById)
bookRoute.patch("/updateBookAuthor/:id",updateBookAuthorById)
bookRoute.patch("/updateBookGenre/:id",updateBookGenreById)
bookRoute.patch("/updateBookCopies/:id",updateBookAvailableCopiesById)
export default bookRoute;