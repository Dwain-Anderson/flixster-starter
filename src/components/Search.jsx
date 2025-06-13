
import "../styles/Search.css"

export default function Search({ setOnSearch, setSearchQuery, stateStack, setStateStack }) {

    const handleSubmit = (event) => {
        event.preventDefault()
        setSearchQuery((new FormData(event.target)).get('query'))
        setOnSearch(true)
        stateStack.push("searchPage")
        setStateStack([...stateStack])
        event.target.reset()
    };

    const handleClick = (event) => {
        event.preventDefault()
        setSearchQuery("")
        setOnSearch(false)
        stateStack.push("clearSearch")
        setStateStack([...stateStack])
    }

    return (
        <div className="search-container">
            <form className="search-form" onSubmit={handleSubmit}>
                <label htmlFor="movie-search" className="sr-only">Search for movies</label>
                <input
                    id="movie-search"
                    className="search-input"
                    type="text"
                    name="query"
                    placeholder="Search for movies"
                    aria-label="Search for movies"
                />
                <button className="search-button" type="submit"> Search </button>
            </form>
            <button className="search-button" onClick={handleClick}>Clear Search Results</button>
        </div>
    )
}
