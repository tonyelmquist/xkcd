import React from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Segment,
  Container,
  Header,
  Icon,
  Checkbox,
  Image,
  Grid,
  Sidebar,
  Menu
} from "semantic-ui-react";
import axios from "axios";

import NoDataMessage from "../components/NoData";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCartoon: null,
      cartoons: [],
      showFavorites: false,
      isLoading: true,
      isLoadingMore: false,
      isMoreData: true,
      visible: true
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3000/proxy?url=http://xkcd.com/info.0.json`) // fetch the current XKCD comic. The site does not support CORS requests, so we make the request via a pass-through node server
      .then(response => {
        const lastCartoon = response.data.num; // get the number of the latest cartoon
        this.getCartoons(lastCartoon);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getCartoons = lastCartoon => {
    this.setState({ lastCartoon });
    this.getMoreCartoons(lastCartoon);
  };

  getMoreCartoons = firstCartoon => {
    let lastCartoonToFetch = firstCartoon - 25; // set the number of the current cartoon - 25
    let cartoonToFetch = firstCartoon;
    if (lastCartoonToFetch <= 0) {
      lastCartoonToFetch = 0;
      this.setState({ isMoreData: false });
    }
    do {
      // loop through cartoon numbers and fetch JSON for each
      this.fetchCartoon(cartoonToFetch);
      cartoonToFetch = cartoonToFetch - 1;
    } while (cartoonToFetch >= lastCartoonToFetch);
  };

  fetchCartoon = cartoonToFetch => {
    axios
      .get(
        `http://localhost:3000/proxy?url=http://xkcd.com/${cartoonToFetch}/info.0.json` // fetch JSON for a single cartoon using passthrough server - the API only returns data for a single cartoon at a time
      )
      .then(response => {
        this.mapCartoonToState(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  mapCartoonToState = cartoonData => {
    const cartoon = {
      title: cartoonData.alt,
      img: cartoonData.img,
      date: `${cartoonData.month}-${cartoonData.day}-${cartoonData.year}`,
      isFavorite: false,
      num: cartoonData.num
    };
    let cartoons = this.state.cartoons; // push new cartoon to array of cartoons
    cartoons.push(cartoon);
    this.setState({ cartoons: cartoons });
    if (cartoon.num < this.state.lastCartoon) {
      this.setState({ lastCartoon: cartoon.num }); // set the lowest number in the cartoon array
    }
  };

  setFavorites = () => {
    this.setState({ showFavorites: true });
  };

  setData = () => {
    this.setState({ showFavorites: false });
  };

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  };

  setFavorite = cartoon => {
    let cartoons = this.state.cartoons;
    cartoons[cartoon].isFavorite = !cartoons[cartoon].isFavorite;
    this.setState({ cartoons: cartoons });
  };

  renderComics = () => {
    let cartoonRows = this.state.cartoons.map((cartoon, i) => (
      <Grid.Row key={i}>
        <Grid.Column width={2}>
          <Checkbox
            toggle
            className="verbose-toggle"
            checked={cartoon.isFavorite}
            onClick={() => this.setFavorite(i)}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <Image src={cartoon.img} size="small" rounded />
        </Grid.Column>
        <Grid.Column width={2}>{cartoon.date}</Grid.Column>
        <Grid.Column width={4}>{cartoon.title}</Grid.Column>
      </Grid.Row>
    ));
    return cartoonRows;
  };

  renderFavorites = () => {
    let cartoonRows = this.state.cartoons.filter(cartoon => cartoon.isFavorite);
    if (cartoonRows.length <= 0) {
      return <NoDataMessage />; // render no data message if no favorites selected
    } else {
      cartoonRows = cartoonRows.map((cartoon, i) => (
        <Grid.Row key={i}>
          <Grid.Column width={2}>{cartoon.date}</Grid.Column>
          <Grid.Column width={6}>
            <Image src={cartoon.img} size="large" rounded />
          </Grid.Column>
          <Grid.Column width={4}>{cartoon.title}</Grid.Column>
        </Grid.Row>
      ));
      return cartoonRows;
    }
  };

  render() {
    return (
      <div class="app">
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="push"
            width="thin"
            visible={this.state.visible}
            icon="labeled"
            vertical
            inverted
          >
            <Menu.Item name="data">
              <Icon name="user" onClick={this.setData} />
              Choose Cartoons
            </Menu.Item>
            <Menu.Item name="favorites">
              <Icon name="thumbs outline up" onClick={this.setFavorites} />
              View Favorites
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              {!this.state.showFavorites ? (
                <Grid>
                  <Grid.Row key="header" fluid>
                    <Icon
                      name="content"
                      onClick={this.toggleVisibility}
                      className="toggle-sidebar"
                    />
                    <h1>Choose your favorite XKCD comics!</h1>
                  </Grid.Row>
                  <Grid.Row key="headers">
                    <Grid.Column width={2}>Set As Favorite</Grid.Column>
                    <Grid.Column width={4} />
                    <Grid.Column width={2}>Date</Grid.Column>
                    <Grid.Column width={4}>Description</Grid.Column>
                  </Grid.Row>
                  {this.renderComics()}

                  {this.state.isMoreData ? (
                    <Grid.Row key="footer">
                      <Grid.Column width={1}>
                        <Button
                          animated
                          loading={this.state.isLoadingMore}
                          onClick={() =>
                            this.getMoreCartoons(this.state.lastCartoon) // kick off new request starting with last cartoon fetched
                          }
                        >
                          <Button.Content visible>View more</Button.Content>
                          <Button.Content hidden>
                            <Icon name="chevron down" />
                          </Button.Content>
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                  ) : (
                    ""
                  )}
                </Grid>
              ) : (
                <Grid>
                  <Grid.Row key="header" fluid>
                    <Icon
                      name="content"
                      onClick={this.toggleVisibility}
                      className="toggle-sidebar"
                    />
                    <h1>Here are your favorite XKCD comics!</h1>
                  </Grid.Row>
                  {this.renderFavorites()}
                </Grid>
              )}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));
