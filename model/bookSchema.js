import { model, Schema } from "mongoose"


const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Book name is required.'],
    },
    author: {
        type: String,
        required: [true, 'Author name is required.'],
    },
    genre: {
        type: String,
        required: [true, 'Genre is required.'],
        maxLength: [50, 'Genre cannot exceed 50 characters.']
    },
    available_copies: {
        type: Number,
        required: [true, 'Number of available copies is required.'],
        min: [0, 'Available copies cannot be negative.']
    }
});
const Book=model("Book",bookSchema)
export default Book;

