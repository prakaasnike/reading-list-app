import { create } from 'zustand';

// Define the structure of a book
export type Book = {
    key: string;
    title: string;
    author_name: string[];
    first_publish_year: string;
    number_of_pages_median: string | null;
    status: 'done' | 'inProgress' | 'backlog';
};

// Define the state of the store related to books
interface BookState {
    books: Book[];
}

// Define the store with actions related to books
interface BookStore extends BookState {
    addBook: (newBook: Book) => void;
    removeBook: (bookToRemove: Book) => void;
    moveBook: (bookToMove: Book, newStatus: Book['status']) => void;
    loadBooksFromLocalStorage: () => void;
    reorderBooks: (
        listType: Book['status'],
        startIndex: number,
        endIndex: number
    ) => void;
}

// Create the Zustand store
export const useStore = create<BookStore>((set) => ({
    books: [],

    // Action to add a new book to the store
    addBook: (newBook: Book) =>
        set((state: BookState) => {
            // Clone the current books and add the new book with 'backlog' status
            const updatedBooks: Book[] = [
                ...state.books,
                { ...newBook, status: 'backlog' },
            ];

            // Update the local storage with the updated books
            localStorage.setItem('readingList', JSON.stringify(updatedBooks));

            // Return the updated state
            return { books: updatedBooks };
        }),

    // Action to remove a book from the store
    removeBook: (bookToRemove: Book) =>
        set((state: BookState) => {
            // Confirm removal with a user prompt
            if (window.confirm('Are you sure to remove this book?')) {
                // Filter out the book to be removed
                const updatedBooks = state.books.filter(
                    (book) => book.key !== bookToRemove.key
                );

                // Update the local storage with the updated books
                localStorage.setItem('readingList', JSON.stringify(updatedBooks));

                // Return the updated state
                return { books: updatedBooks };
            }

            // If user cancels, return the current state
            return state;
        }),

    // Action to move a book to a new status
    moveBook: (bookToMove: Book, newStatus: Book['status']) =>
        set((state: BookState) => {
            // Map through the books and update the status of the specified book
            const updatedBooks = state.books.map((book) =>
                book.key === bookToMove.key ? { ...book, status: newStatus } : book
            );

            // Update the local storage with the updated books
            localStorage.setItem('readingList', JSON.stringify(updatedBooks));

            // Return the updated state
            return { books: updatedBooks };
        }),

    // Action to reorder books within a status list
    reorderBooks: (
        listType: Book['status'],
        startIndex: number,
        endIndex: number
    ) =>
        set((state: BookStore) => {
            // Filter books by the specified status
            const filteredBooks = state.books.filter(
                (book) => book.status === listType
            );

            // Extract the book to be reordered
            const [reorderedBook] = filteredBooks.splice(startIndex, 1);

            // Insert the reordered book at the new index
            filteredBooks.splice(endIndex, 0, reorderedBook);

            // Map through all books and update the order within the specified status
            const updatedBooks = state.books.map((book) =>
                book.status === listType ? filteredBooks.shift() || book : book
            );

            // Update the local storage with the updated books
            localStorage.setItem('readingList', JSON.stringify(updatedBooks));

            // Return the updated state
            return { books: updatedBooks };
        }),

    // Action to load books from local storage on store initialization
    loadBooksFromLocalStorage: () => {
        // Retrieve stored books from local storage
        const storedBooks = localStorage.getItem('readingList');

        // If stored books exist, set them in the store; otherwise, set an empty array
        if (storedBooks) {
            set({ books: JSON.parse(storedBooks) });
        } else {
            set({ books: [] });
        }
        // You may want to parse 'storedBooks' here if needed
    },
}));
