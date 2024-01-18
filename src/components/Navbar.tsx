import { useTheme } from "@/hooks/useTheme"
import { GiSpellBook } from "react-icons/gi"
import { HiMoon, HiSun } from "react-icons/hi"
import { SiYoutube, SiGithub } from "react-icons/si"

function ThemeToggle() {
	const { isDarkMode, toggleDarkMode } = useTheme()

	return (
		<button
			className="h-10 w-10 p-2 text-gray-800 hover:text-amber-500 dark:text-white dark:hover:text-amber-400"
			onClick={() => toggleDarkMode()}
		>
			{isDarkMode ? (
				<HiMoon className="h-full w-full" />
			) : (
				<HiSun className="h-full w-full" />
			)}
		</button>
	)
}

export function Navbar() {
	return (
		<header className="sticky top-0 z-10 w-full border-b border-gray-700 bg-gray-900 dark:border-gray-600 dark:bg-black">
			<div className="flex h-16 items-center px-4 sm:px-8 lg:px-44">
				{/* Logo and site name/icon */}
				<div className="flex flex-1 items-center justify-start">
					<a href="/">
						{/* Replace with your logo or site name */}
						<GiSpellBook className="h-10 w-10 p-2 text-gray-800 dark:text-white" />
					</a>
				</div>

				<div className="flex flex-1 items-center justify-end">
					{/* Navigation Links */}
					<nav className="flex items-center space-x-4">
						{/* ThemeToggle component */}
						<ThemeToggle />

						{/* YouTube link */}
						<a
							href="https://www.youtube.com/@m6io"
							target="_blank"
							rel="noopener noreferrer"
							className="h-10 w-10 p-2 text-gray-800 hover:text-[#ff0000] dark:text-white dark:hover:text-[#ff0000]"
						>
							<SiYoutube className="h-full w-full" />
						</a>

						{/* GitHub link */}
						<a
							href="https://www.github.com/m6io"
							target="_blank"
							rel="noopener noreferrer"
							className="h-10 w-10 p-2 text-gray-800 hover:text-[#4078c0] dark:text-white dark:hover:text-[#4078c0]"
						>
							<SiGithub className="h-full w-full" />
						</a>
					</nav>
				</div>
			</div>
		</header>
	)
}
