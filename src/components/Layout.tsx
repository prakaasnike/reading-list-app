import React from "react"
import { Navbar } from "./Navbar"

export const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative min-h-screen bg-white dark:bg-gray-900">
			<Navbar />
			<main className="px-8 sm:px-8 lg:px-44">
				<div className="mx-auto max-w-3xl space-y-20">{children}</div>
			</main>
		</div>
	)
}
