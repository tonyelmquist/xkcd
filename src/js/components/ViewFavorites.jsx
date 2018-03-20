import React from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Icon,
  Image,
  Grid,
} from "semantic-ui-react";
import propTypes from 'prop-types';

import NoDataMessage from "./NoData";

class ViewFavorites extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFavorites = () => {
    let cartoonRows = this.props.cartoons.filter(cartoon => cartoon.isFavorite);
    if (cartoonRows.length <= 0) {
      return <NoDataMessage />; // render no data message if no favorites selected
    } else {
      cartoonRows = cartoonRows.map((cartoon, i) => (
        <Grid.Row key={i}>
          <Grid.Column width={6}>
            <Image src={cartoon.img} size="large" rounded />
          </Grid.Column>
          <Grid.Column width={2}>{cartoon.date}</Grid.Column>
          <Grid.Column width={4}>{cartoon.title}</Grid.Column>
        </Grid.Row>
      ));
      return cartoonRows;
    }
  };

  render() {
    return (
      <Grid>
        <Grid.Row key="header">
          <Icon
            name="content"
            onClick={this.props.toggleVisibility}
            className="toggle-sidebar"
          />
          <h1>Here are your favorite XKCD comics!</h1>
        </Grid.Row>
        <Grid.Row key="headers" className="headers">
          <Grid.Column width={6}>Your Favorites</Grid.Column>
          <Grid.Column width={2}>Date</Grid.Column>
          <Grid.Column width={4}>Description</Grid.Column>
        </Grid.Row>
        {this.renderFavorites()}
      </Grid>
    );
  }
}

ViewFavorites.propTypes = {
    cartoons: propTypes.array.isRequired,
    toggleVisibility: propTypes.func.isRequired,
};

export default ViewFavorites;
