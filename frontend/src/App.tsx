import React, {Component} from 'react';
import './css/App.scss';
import MovieRequest from './movieRequest'
// import MoviePage from './MoviePage'

class App extends Component<{}> {

    render() {
        console.log("app rendered");
        return (
            <div className="App">
                {/*For testing*/}
                <MovieRequest/>
            </div>

        );
    }
}


export default App;
