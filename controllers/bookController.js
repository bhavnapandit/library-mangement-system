import Book from "../model/bookSchema.js"
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        if (!books || books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addBook = async (req, res) => {
    try {
        const { title, author, genre, available_copies } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Book title is required" });
        }
        if (!author) {
            return res.status(400).json({ message: "Author name is required" });
        }
        if (!genre) {
            return res.status(400).json({ message: "Genre is required" });
        }
        if (available_copies == null) {
            return res.status(400).json({ message: "Number of available copies is required" });
        }
        if (available_copies < 0) {
            return res.status(400).json({ message: "Number of available copies cannot be negative" });
        }
        const existingBook = await Book.findOne({ title, author });
        if (existingBook) {
            existingBook.available_copies += available_copies;
            await existingBook.save();
            return res.status(200).json({ message: `${existingBook.title} book copy is added!` });
        }
        else {
            const newBook = await Book.create({ title, author, genre, available_copies: available_copies })
            return res.status(201).json({ message: `${newBook.title} book copy is added!` });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const addManyBooks = async (req, res) => {
    try {
        const books = req.body;
        if (!Array.isArray(books)) {
            return res.status(400).json({ message: "Request body should contain an array of books" });
        }
        const addedBooks = await Promise.all(books.map(async book => {
            const existingBook = await Book.findOne({ title: book.title, author: book.author });
            if (existingBook) {
                existingBook.available_copies += book.available_copies;
                await existingBook.save();
                return existingBook;
            }
            else {
                return await Book.create(book);
            }
        }));
        if (!addedBooks) {
            return res.status(400).json({ message: "Failed to add books" });
        }
        return res.status(201).json({ message: `${addedBooks.length} books are added!` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteBookById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ message: `${deletedBook.title} book is deleted.` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Book ID format" });
        }
        return res.status(500).json({ message: error.message });
    }
}


export const deleteBooks = async (req, res) => {
    try {
        const result = await Book.deleteMany()
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No book found to delete" })
        }
        const deletedCount = result.deletedCount;
        const message = deletedCount === 1 ? `${deletedCount} book was deleted.` : `${deletedCount} books were deleted.`;
        return res.status(200).json({ message });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// 1. updateBookById: Update details of a specific book by its ID.
export const updateBookById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: "No book found to update" });
        }
        const { title, author, genre, available_copies } = req.body;
        const updateBook = {
            title: title ? title : existingBook.title,
            author: author ? author : existingBook.author,
            genre: genre ? genre : existingBook.genre,
            available_copies: available_copies !== undefined ? available_copies : existingBook.available_copies,
        };
        const updatedBook = await Book.findByIdAndUpdate(id, updateBook, { new: true });
        if (!updatedBook) {
            return res.status(400).json({ message: "Failed to update book" });
        }
        return res.status(200).json({ message: `${updatedBook.title} book is updated.` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// 2. searchBooks: Search for books based on certain criteria like title, author, or genre.
export const searchBooks = async (req, res) => {
    try {
        const { title, author, genre } = req.query;
        const query = {};
        if (title) {
            query.title = new RegExp(title, 'i');
        }
        if (author) {
            query.author = new RegExp(author, 'i');
        }
        if (genre) {
            query.genre = new RegExp(genre, 'i');
        }
        const books = await Book.find(query);
        if (!books || books.length === 0) {
            return res.status(404).json({ message: "No books found matching the criteria" });
        }
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// 3. getBookById: Retrieve details of a specific book by its ID.
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: `No book found with this ID: ${id}` });
        }
        return res.status(200).json(existingBook);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// 4. countBooks: Count total books or books by a specific criteria.
export const countBooks = async (req, res) => {
    try {
        const count = await Book.countDocuments();
        if (typeof count !== 'number') {
            return res.status(500).json({ message: "Failed to count books due to server error" });
        }
        if (count === 0) {
            return res.status(404).json({ message: "No books found in the library" });
        }
        return res.status(200).json({ message: `There are ${count} books in the library.` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// 5. deleteBookByTitle: Delete a book by its title.
export const deleteBookByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        if (!title) {
            return res.status(400).json({ message: "Book title is required" });
        }
        const deletedBook = await Book.deleteOne({ title: title });
        if (!deletedBook || deletedBook.deletedCount === 0) {
            return res.status(404).json({ message: "No books matching book found to delete" });
        }
        if (deletedBook.deletedCount > 1) {
            return res.status(400).json({ message: "More than one book found with the same title. Please delete by ID instead" });
        }
        return res.status(200).json({ message: `${title} book is deleted` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book title format" });
        }
        return res.status(500).json({ message: error.message });
    }
}

// 6. deleteBooksByAuthor: Delete all books by a specific author.
export const deleteBooksByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        if (!author) {
            return res.status(400).json({ message: "Book author is required" });
        }
        const deletedBook = await Book.deleteMany({ author });
        if (!deletedBook || deletedBook.deletedCount === 0) {
            return res.status(404).json({ message: `No books by ${author} found to delete` });
        }
        return res.status(200).json({ message: `All books by ${author} are deleted` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book author format" });
        }
        return res.status(500).json({ message: error.message });
    }
}

// 7. updateBookTitleById: Update the title of a specific book by its ID.
export const updateBookTitleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: "No book found to update" });
        }
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Book title is required" });
        }
        const updatedBook = await Book.updateOne({ _id: id }, { title: title });
        if (!updatedBook || updatedBook.nModified === 0) {
            return res.status(400).json({ message: "Book title is not updating" });
        }
        return res.status(200).json({ message: `${title} book title is updated` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        return res.status(500).json({ message: error.message });
    }
}

// 8. updateBookAuthorById: Update the author of a specific book by its ID.
export const updateBookAuthorById = async (req, res) => {
   try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: "No book found to update" });
        }
        const { author } = req.body;
        if (!author) {
            return res.status(400).json({ message: "Book author is required" });
        }
        const updatedBook = await Book.updateOne({ _id: id }, { author: author });
        if (!updatedBook || updatedBook.nModified === 0) {
            return res.status(400).json({ message: "Book author is not updating" });
        }
        return res.status(200).json({ message: `${existingBook.title} book author is updated` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        return res.status(500).json({ message: error.message });
    }
}

// 9. updateBookGenreById: Update the genre of a specific book by its ID.
export const updateBookGenreById = async (req, res) => {
   try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: "No book found to update" });
        }
        const { genre } = req.body;
        if (!genre) {
            return res.status(400).json({ message: "Book genre is required" });
        }
        const updatedBook = await Book.updateOne({ _id: id }, { genre: genre });
        if (!updatedBook || updatedBook.nModified === 0) {
            return res.status(400).json({ message: "Book genre is not updating" });
        }
        return res.status(200).json({ message: `${existingBook.title} book genre is updated` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        return res.status(500).json({ message: error.message });
    }
}

// 10. updateBookAvailableCopiesById: Update the number of available copies of a specific book by its ID.
export const updateBookAvailableCopiesById = async (req, res) => {
   try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const existingBook = await Book.findById(id);
        if (!existingBook) {
            return res.status(404).json({ message: "No book found to update" });
        }
        const { available_copies } = req.body;
        if (!available_copies) {
            return res.status(400).json({ message: "Book availableCopies is required" });
        }
        const updatedBook = await Book.updateOne({ _id: id }, { available_copies: available_copies });
        if (!updatedBook || updatedBook.nModified === 0) {
            return res.status(400).json({ message: "Book available_copies is not updating" });
        }
        return res.status(200).json({ message: `${existingBook.title} book available_cpies is increased` });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        return res.status(500).json({ message: error.message });
    }
}
