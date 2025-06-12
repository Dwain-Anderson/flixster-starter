import { useState } from 'react';
import "../styles/Sidebar.css";

export default function Sidebar({ setShowDefaultMovies, stateStack, setStateStack}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (buttonName) => (event) => {
        event.preventDefault();
        switch (buttonName) {
            case "favorited": case "watched":
                setShowDefaultMovies(false);
                stateStack.push(buttonName);
                setStateStack([...stateStack]);
                break;
            case "home": default:
                setShowDefaultMovies(true);
                stateStack.push(buttonName);
                setStateStack([...stateStack]);
                break;
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isOpen ? '×' : '☰'}
            </button>
            <div className="sidebar-content">
                <button
                    className="sidebar-button"
                    onClick={handleClick("home")}
                >
                    Home
                </button>
                <button
                    className="sidebar-button"
                    onClick={handleClick("favorited")}
                >
                    Favorites
                </button>
                <button
                    className="sidebar-button"
                    onClick={handleClick("watched")}
                >
                    Watched
                </button>
            </div>
        </div>
    );
};
