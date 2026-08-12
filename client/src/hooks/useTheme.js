import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// A pure UI preference, not server data - localStorage is the right tool
// here (unlike DataContext, which deliberately avoids it for real data).
export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    // Synchronizing React state with two things outside React (the DOM
    // attribute every component's CSS reads, and persisted storage) is
    // exactly what an effect is for - no setState happens in here.
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    }

    return { theme, toggleTheme };
}

export default useTheme;
