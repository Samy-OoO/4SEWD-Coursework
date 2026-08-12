import { useEffect, useRef, useState } from 'react';

// A compact "•••" menu instead of stacking multiple text links in a row.
// Closes itself on outside click. `children` are the menu items
// (links/buttons) - clicking any of them also closes the menu.
export default function ActionMenu({ children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="action-menu" ref={ref}>
            <button type="button" className="action-menu-trigger" onClick={() => setOpen((v) => !v)} aria-label="Actions">
                •••
            </button>
            {open && (
                <div className="action-menu-dropdown" onClick={() => setOpen(false)}>
                    {children}
                </div>
            )}
        </div>
    );
}
