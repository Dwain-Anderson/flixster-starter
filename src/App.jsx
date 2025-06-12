import MoviesPage from './pages/MoviesPage'
import Footer from './components/Footer'
import Header from "./components/Header";
import './App.css'

export default function App() {
  return (
    <div className="App">
      <Header />
        <MoviesPage />
      <Footer />
    </div>
  )
}
