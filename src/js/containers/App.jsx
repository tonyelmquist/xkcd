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
import ViewCartoons from "../components/ViewCartoons";
import ViewFavorites from "../components/ViewFavorites";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCartoon: 0,
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

  render() {
    return (
      <div className="app">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            width="thin"
            visible={this.state.visible}
            icon="labeled"
            vertical
            inverted
          >
            <Menu.Item name="data" className={this.state.showFavorites ? 'inactive' : 'active'}>
              <Icon name="user" onClick={this.setData} />
              Choose Cartoons
            </Menu.Item>
            <Menu.Item name="favorites" className={this.state.showFavorites ? 'active' : 'inactive'}>
              <Icon name="thumbs outline up" onClick={this.setFavorites} />
              View Favorites
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              {!this.state.showFavorites ? (
                <ViewCartoons
                  cartoons={this.state.cartoons}
                  setFavorite={this.setFavorite}
                  getMoreCartoons={this.getMoreCartoons}
                  lastCartoon={this.state.lastCartoon}
                  toggleVisibility={this.toggleVisibility}
                  isLoadingMore={this.state.isLoadingMore}
                />
              ) : (
                <ViewFavorites
                  cartoons={this.state.cartoons}
                  toggleVisibility={this.toggleVisibility}
                />
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
