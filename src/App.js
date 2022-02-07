import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Main from "./Main";

function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route exact path={'/portfolio/:id'} element={<Main />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
