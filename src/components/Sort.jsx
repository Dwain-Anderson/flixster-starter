export default function Sort({setSortDetails, stateStack, setStateStack }) {

    const handleClick = (event) => {
        event.preventDefault();
        console.log("handleClick event.target.default:", event.target.value)
        setSortDetails(event.target.value)
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
