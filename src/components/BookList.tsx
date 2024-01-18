import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { useStore, Book } from "@/store"
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./StrictModeDroppable"

export const BookList = () => {
	const { books, removeBook, moveBook, reorderBooks } = useStore(
		(state) => state,
	)

	const moveToList = (book: Book, targetList: Book["status"]) => {
		moveBook(book, targetList)
	}

	const renderBookItem = (
		book: Book,
		index: number,
		listType: Book["status"],
	) => (
		<Card key={index}>
			<CardHeader>
				<CardTitle>{book.title}</CardTitle>
				<CardDescription>{book.author_name}</CardDescription>
				<CardFooter className="flex justify-between">
					<Button variant="destructive" onClick={() => removeBook(book)}>
						Remove
					</Button>
					<div className="inline-flex gap-2 ">
						<Button
							variant="outline"
							onClick={() => moveToList(book, "inProgress")}
							disabled={listType === "inProgress"}
						>
							In Progress
						</Button>
						<Button
							variant="outline"
							onClick={() => moveToList(book, "backlog")}
							disabled={listType === "backlog"}
						>
							Backlog
						</Button>
						<Button
							variant="outline"
							onClick={() => moveToList(book, "done")}
							disabled={listType === "done"}
						>
							Done
						</Button>
					</div>
				</CardFooter>
			</CardHeader>
		</Card>
	)

	// This function is called when a drag-and-drop operation ends
	const onDragEnd = (result: DropResult) => {
		// If there is no destination (the dragged item was dropped outside of a droppable area), exit
		if (!result.destination) return
		// Get the index of the dragged item's original position
		const sourceIndex = result.source.index
		// Get the index of the dragged item's new position
		const destinationIndex = result.destination.index
		// Determine the type of list (status) from which the item was dragged
		const listType = result.source.droppableId as Book["status"]
		// Call the function to reorder the books based on the drag-and-drop result
		reorderBooks(listType, sourceIndex, destinationIndex)
	}

	const renderDraggableBookList = (listType: Book["status"]) => {
		// Filter books based on the specified listType (status)
		const filteredBooks = books.filter((book) => book.status === listType)

		return (
			<StrictModeDroppable droppableId={listType}>
				{(provided) => (
					// The outer div with droppable properties
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{filteredBooks.map((book, index) => (
							// Draggable component for each book
							<Draggable key={book.key} draggableId={book.key} index={index}>
								{(provided) => (
									// The inner div with draggable properties
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										className="my-2"
									>
										{/* Drag handle for each book */}
										<div {...provided.dragHandleProps}>
											{/* Render the book item */}
											{renderBookItem(book, index, listType)}
										</div>
									</div>
								)}
							</Draggable>
						))}
						{/* Placeholder for dropped items */}
						{provided.placeholder}
					</div>
				)}
			</StrictModeDroppable>
		)
	}

	return (
		<div className="space-y-8 p-4">
			<h2 className="text-exl mb-4 font-bold">Reading List</h2>
			<DragDropContext onDragEnd={onDragEnd}>
				{books.filter((book) => book.status === "inProgress").length > 0 && (
					<>
						<h3 className="mb-2 text-xl font-semibold">In Progress</h3>
						{/* <div>
							{books
								.filter((book) => book.status === "inProgress")
								.map((book, index) =>
									renderBookItem(book, index, "inProgress"),
								)}
						</div> */}
						{renderDraggableBookList("inProgress")}
					</>
				)}
			</DragDropContext>
			<DragDropContext onDragEnd={onDragEnd}>
				{books.filter((book) => book.status === "backlog").length > 0 && (
					<>
						<h3 className="mb-2 text-xl font-semibold">Backlog</h3>
						{/* <div>
							{books
								.filter((book) => book.status === "backlog")
								.map((book, index) => renderBookItem(book, index, "backlog"))}
						</div> */}
						{renderDraggableBookList("backlog")}
					</>
				)}
			</DragDropContext>
			{books.filter((book) => book.status === "done").length > 0 && (
				<>
					<h3 className="mb-2 text-xl font-semibold">Done</h3>
					<div>
						{books
							.filter((book) => book.status === "done")
							.map((book, index) => renderBookItem(book, index, "done"))}
					</div>
				</>
			)}
		</div>
	)
}
