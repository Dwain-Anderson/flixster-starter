
import "../styles/Search.css"

export default function Search({setSearchQuery, stateStack, setStateStack, toggleClick}) {

    const handleSubmit = (event) => {
        event.preventDefault()
        setSearchQuery((new FormData(event.target)).get('query'))
        toggleClick(false)
        stateStack.push("searchPage")
        setStateStack([...stateStack])
    };

    const handleClear = (event) => {
        event.preventDefault()
        setSearchQuery("")
        stateStack.push("clearSearch&toggleView")
        setStateStack([...stateStack])
    }

    return (
        <div className="search-container">
         <form className="search-form" onSubmit={handleSubmit}>
            <input className="search-input" type="text" name="query"  placeholder="Search for movies" />
            <button className="search-button" type="submit"> Search </button>
        </form>
         <button className="search-button" onClick={handleClear}>Clear Search Results</button>
     </div>
    )
}
