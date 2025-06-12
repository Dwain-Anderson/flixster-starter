import "../styles/Sort.css"

export default function Sort({setSortDetails, stateStack, setStateStack }) {

    const handleClick = (event) => {
        event.preventDefault();
        setSortDetails(event.target.value)
        stateStack.push("sortData")
        setStateStack([...stateStack])
    }

    return (
    <div id="sort-container" className="container">
        <form id="sort-menu" className="form">
            <label htmlFor="sort-select" id="sort-label"> <p className="sort-by"> Sort by:</p></label>
            <select onChange={handleClick} id="sort-select" className="sort-select">
                <option value="title">Title</option>
                <option value="release-date">Release Date</option>
                <option value="vote-average">Vote Average</option>
            </select>
        </form>
    </div>
    )
}
