import React, { useState, useEffect, FormEvent } from 'react';
import { Genre, Movie, User } from './apiTypes';
import './css/Nav.scss';
import './css/App.scss';
import particleConfig from './particleConfig';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { MovieCards } from './MovieCards';
import SearchBar from 'search-bar-react';
import Button from 'react-bootstrap/Button';
import { goToTop } from 'react-scrollable-anchor'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Particles from 'react-particles-js';
import MovieRequest from './movieRequest';
import useFetch from "react-fetch-hook";
import MoviePage from './MoviePage';
import InfiniteScroll from 'react-infinite-scroller';
import LoginPage from './LoginPage';


function App() {
  const [searchQuery, setSearchQueryState] = useState<string>('');
  const [movies, setMoviesState] = useState<Movie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [genreSelected, setGenreSelected] = useState<number>(1);
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const genreFetched = useFetch<Genre[]>("http://localhost:8000/genres/");


  useEffect(() => {
    const updateMovies = async () => {
      const response = await fetch("http://localhost:8000/movies/?gid=" + genreSelected + "&name=" + searchQuery);
      setMoviesState(await response.json() as Movie[]);
    }
    updateMovies();

  }, [searchQuery, genreSelected])





  const [genres, setGenres] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (!genreFetched.isLoading && genreFetched.data) {
      let newGenres = [];
      for (const genre of genreFetched.data) {
        newGenres.push(
          <option value={genre.gid}>{genre.genre}</option>);
      }
      setGenres(newGenres);
    }
  }, [genreFetched.data, genreFetched.isLoading]);


  const [user, setUser] = useState<User>();

  const [showMoviePage, setShowMoviePage] = useState<boolean>(false);
  const [showRequestPage, setShowRequestPage] = useState<boolean>(false);
  const [showSubmittedRequestPage, setShowSubmittedRequestPage] = useState<boolean>(false);
  const [movieTrailerUrl, setMovieTrailerUrl] = useState<string>('');



  useEffect(() => {



  });



  return (

    <div className="App">
      <div className="sticky-top">
        <Navbar collapseOnSelect={true} id="custom" expand="lg" bg="black" variant="dark" sticky="top">
          <Navbar.Brand id="custom" href="#home" onClick={goToTop}>
            Popcorn <Image src="popcorn.svg"></Image>
          </Navbar.Brand>
          <Container>
            <Col>
              <Row>
                <Col xs="7">
                  <SearchBar
                    onChange={(text) => setSearchQueryState(text)}
                    onFocus={() => { }}
                    size='medium'
                    width='100%'
                    autoFocus={true}
                    placeholder='Type to search'
                    onClear={() => { setSearchQueryState('') }}
                    value='' />
                </Col>
                <Col xs="4">
                  <Form.Select
                    aria-label="Select a Genre"
                    onChange={(event: FormEvent<HTMLSelectElement>) => { setGenreSelected(parseInt(event.currentTarget.value) as number) }}>
                    <option value={0}>Select Genre</option>
                    {genres}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="NavButtons">
                <Col xs="5">
                  <Button className="request" disabled={!sessionStorage.token || user?.accesslevel === 1} onClick={() => { setShowRequestPage(true) }}> Submit Request</Button>
                </Col>
                <Col xs="5" >
                  <Button className="submitted" disabled={!sessionStorage.token} onClick={() => { setShowSubmittedRequestPage(true) }}>Submitted Requests</Button>
                </Col>
              </Row>
            </Col>
          </Container>


          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav id="custom" className="ml-auto">
              <Nav.Item>
                <Button onClick={() => { setShowLogin(true); }}>Login</Button>
              </Nav.Item>
              <Nav.Item>
                <Button>Register</Button>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <InfiniteScroll
        pageStart={1}
        loadMore={(page) => { setPageNumber(page); }}
        hasMore={false}
        loader={<div className="loader" key={0}>Loading ...</div>}>
        <div className="content">

          <div id="MoviesDiv">
            <MoviePage user={user} show={showMoviePage} onHide={() => { setShowMoviePage(false); }}
              movieTrailerUrl={movieTrailerUrl} movie={selectedMovie} />
            <MovieRequest user={user} show={showRequestPage || showSubmittedRequestPage} onHide={() => { setShowRequestPage(false); setShowSubmittedRequestPage(false); }}
              hidePastRequests={showRequestPage} />
            <LoginPage show={showLogin} onHide={(user, userToken) => {
              if (userToken) {
                setUser(user);
                sessionStorage.setItem('token', userToken);
              }
              setShowLogin(false);
            }}></LoginPage>
            <Container>
              <Particles className='particles'
                params={particleConfig} />
            </Container>
            <h2>  Movies </h2>

            <MovieCards movies={movies} displayMovieView={(movie, youtubeURL) => {
              setMovieTrailerUrl(youtubeURL);
              setSelectedMovie(movie);
              setShowMoviePage(true);

            }} append={false}></MovieCards>


          </div>
        </div>
      </InfiniteScroll>

    </div>



  );
}


export default App;
