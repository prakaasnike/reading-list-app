import axios from "axios"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Book, useStore } from "@/store"

export const BookSearch = () => {
	const { books, addBook } = useStore((state) => state)
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<Book[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalResults, setTotalResults] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	const resultsPerPage = 100

	type SearchResult = {
		docs: Book[]
		numFound: number
	}

	const searchBooks = async (page: number = 1) => {
		if (!query) return

		setIsLoading(true)
		try {
			const response = await axios.get<SearchResult>(
				`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`,
			)

			setResults(response.data.docs)
			setTotalResults(response.data.numFound)
			setCurrentPage(page)
		} catch (error) {
			console.error("Error Fetching OpenLibrary Api Data", error)
		}
		setIsLoading(false)
	}

	//Handle Keyboard enter on button
	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			searchBooks()
		}
	}

	const handlePreviousClick = () => {
		if (currentPage > 1) {
			searchBooks(currentPage - 1)
		}
	}
	const handleNextClick = () => {
		if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
			searchBooks(currentPage + 1)
		}
	}

	const startIndex = (currentPage - 1) * resultsPerPage + 1

	const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults)

	return (
		<div className="-m-1.5 overflow-x-auto">
			<div className="sm:dark-divide-gray-700 sm:divide-y sm:divide-gray-200 sm:rounded-2xl sm:border sm:dark:border-gray-700">
				<div className="sm:max-w-xs">
					<Input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search for your next book"
						onKeyUp={handleKeyPress}
					/>
				</div>
				<Button disabled={isLoading} onClick={() => searchBooks()}>
					{isLoading ? "Searching..." : "Search"}
				</Button>
				<div className="mt-2">
					{totalResults > 0 && (
						<p className="text-sm">
							Showing {startIndex} - {endIndex} out of {totalResults} results
						</p>
					)}
				</div>
				<div className="mt-4 max-h-64 overflow-auto">
					{/* Conditional rendering using ternary operator */}
					{query.length > 0 && results.length > 0 ? (
						// Display table when both query and results are available
						<Table>
							<TableHeader>
								<TableRow>
									{/* Table headers */}
									<TableHead className="p-2">Title</TableHead>
									<TableHead className="p-2">Author</TableHead>
									<TableHead className="p-2">Year</TableHead>
									<TableHead className="p-2">Page Count</TableHead>
									<TableHead className="p-2"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{/* Mapping through results to display table rows */}
								{results.map((book, index) => (
									<TableRow key={index}>
										{/* Displaying book information in table cells */}
										<TableCell>{book.title}</TableCell>
										<TableCell>{book.author_name}</TableCell>
										<TableCell>{book.first_publish_year}</TableCell>
										<TableCell>
											{book.number_of_pages_median || "N/A"}
										</TableCell>
										<TableCell>
											{/* Button to add book to the list */}
											<Button
												variant="link"
												onClick={() => {
													addBook({
														key: book.key,
														title: book.title,
														author_name: book.author_name,
														first_publish_year: book.first_publish_year,
														number_of_pages_median:
															book.number_of_pages_median || null,
														status: "backlog",
													})
												}}
												// Disable button if the book is already in the list
												disabled={books.some((b) => b.key === book.key)}
											>
												Add
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						// Display a message when there is no query or results
						<div className="flex max-h-60 items-center justify-center p-16">
							<p>Start Your Search</p>
						</div>
					)}
				</div>

				<div className="mt-4 flex items-center justify-between">
					<Button
						variant="outline"
						onClick={handlePreviousClick}
						disabled={currentPage <= 1 || isLoading}
					>
						Previous
					</Button>
					<span>Page {currentPage}</span>
					<Button
						variant="outline"
						onClick={handleNextClick}
						disabled={
							currentPage >= Math.ceil(totalResults / resultsPerPage) ||
							isLoading
						}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
