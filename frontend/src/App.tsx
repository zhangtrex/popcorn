import React, { Component } from 'react';
import './css/App.scss';
import MoviePage from './MoviePage'


class App extends Component<{}> {

  render() {
    console.log("app rendered");
    return (
      <div className="App">
        {/*For testing*/}
        <MoviePage />
      </div>
      
    );
  }
}



export default App;
