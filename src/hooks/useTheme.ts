import { useState, useEffect } from "react";

export const useTheme = (storageKey = "vite-ui-theme") => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem(storageKey)
            ? localStorage.getItem(storageKey) === "true"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // useEffect hook to apply changes whenever the theme state changes
    useEffect(() => {
        const root = window.document.documentElement; // Access the root element of the document
        root.classList.remove("light", "dark"); // Remove any existing theme classes
        root.classList.add(isDarkMode ? "dark" : "light"); // Add the current theme class based on isDarkMode state
        localStorage.setItem(storageKey, isDarkMode.toString()); // Save the current theme preference to local storage
    }, [isDarkMode, storageKey]); // Dependencies array, effect runs when these values change

    // Function to toggle the theme state
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Set the isDarkMode state to the opposite of its current value

    // Return the theme state and the toggle function from the hook
    return { isDarkMode, toggleDarkMode };
};
