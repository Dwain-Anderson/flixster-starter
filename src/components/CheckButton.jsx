import { useState } from "react"
import "../styles/CheckButton.css"

export default function CheckButton({ visualElement }) {
    const [checkState, setCheckState] = useState(false);

    function handleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        setCheckState(!checkState);
    }

    return (
        <button className={visualElement.name} onClick={handleClick}>
            <div className="checkButton-icon">
                <img className="checkButton-img" src={checkState ? visualElement.checkedIcon : visualElement.uncheckedIcon} />
            </div>
        </button>
    )
}
