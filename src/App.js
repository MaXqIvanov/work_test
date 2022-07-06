import './App.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Main from "./view/Main";
import { Provider } from 'react-redux';
import { store } from './store/store';
function App() {
  return (
    <div className="App">
       <Provider store={store}>
          <Router>
              <Routes>
                  <Route exact path={'/'} element={<Main />} />
              </Routes>
          </Router>
        </Provider>  
    </div>
  );
}

export default App;
