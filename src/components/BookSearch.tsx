import axios from "axios"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const BookSearch = () => {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<any[]>([])
	const [isloading, setIsLoading] = useState(false)

	type SearchResult = {
		docs: any[]
		numFound: number
	}

	const searchBooks = async () => {
		if (!query) return

		setIsLoading(true)
		try {
			const response = await axios.get<SearchResult>(
				`https://openlibrary.org/search.json?q=$query`,
			)

			setResults(response.data.docs)
		} catch (error) {
			console.error("Error Fetching OpenLibrary Api Data", error)
		}
		setIsLoading(false)
	}

	return (
		<div className="p-4">
			<Button />
			<Input />
		</div>
	)
}
