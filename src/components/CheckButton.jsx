import { useState } from "react"
import "../styles/CheckButton.css"

export default function CheckButton({ visualElement, movie, updateCheckedMovies}) {
    const [checkState, setCheckState] = useState(false);

    const buttonLabel = checkState
        ? `Mark as un${visualElement.name}`
        : `Mark as ${visualElement.name}`;

    const imageAlt = checkState
        ? `${visualElement.name.charAt(0).toUpperCase() + visualElement.name.slice(1)}`
        : `Not ${visualElement.name}`;

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let newState = !checkState;
        setCheckState(newState);
        updateCheckedMovies(visualElement.name, movie, newState);
    }

    return (
        <button
            className={visualElement.name}
            onClick={handleClick}
            aria-label={imageAlt}
            title={buttonLabel}
            role="checkbox"
            aria-checked={checkState}
        >
            <div className="checkButton-icon">
                <img
                    className="checkButton-img"
                    src={checkState ? visualElement.checkedIcon : visualElement.uncheckedIcon}
                    alt={imageAlt}
                />
            </div>
            <span className="sr-only">{buttonLabel}</span>
        </button>
    )
}
