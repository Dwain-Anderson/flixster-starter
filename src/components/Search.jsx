
import "../styles/Search.css"

export default function Search({setSearchQuery, stateStack, setStateStack}) {

    const handleSubmit = (event) => {
        event.preventDefault()
        setSearchQuery((new FormData(event.target)).get('query'))
        stateStack.push("searchPage")
        setStateStack([...stateStack])
        event.target.reset()
    };

    const handleClick = (event) => {
        event.preventDefault()
        setSearchQuery("")
        stateStack.push("clearSearch")
        setStateStack([...stateStack])
    }

    return (
        <div className="search-container">
         <form className="search-form" onSubmit={handleSubmit}>
            <input className="search-input" type="text" name="query"  placeholder="Search for movies" />
            <button className="search-button" type="submit"> Search </button>
        </form>
         <button className="search-button" onClick={handleClick}>Clear Search Results</button>
     </div>
    )
}
