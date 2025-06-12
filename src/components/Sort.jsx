import "../styles/Sort.css"

export default function Sort({setSortDetails, stateStack, setStateStack }) {

    const handleClick = (event) => {
        event.preventDefault();
        setSortDetails(event.target.value)
        stateStack.push("sortData")
        setStateStack([...stateStack])
    }

    return (<div id="sort-container" className="container">
        <section id="sort-menu" className="form">
            <label htmlFor="sort-select">Sort by:</label>
            <select onChange={handleClick} id="sort-select" className="select" aria-label="Sort criteria">
                <option value="title">Title</option>
                <option value="release-date">Release Date</option>
                <option value="vote-average">Vote Average</option>
            </select>
        </section>
    </div>
    )
}
