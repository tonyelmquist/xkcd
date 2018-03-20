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

class ViewCartoons extends React.Component {
  constructor(props) {
    super(props);
  }

  renderComics = () => {
    let cartoonRows = this.props.cartoons.map((cartoon, i) => (
      <Grid.Row key={i}>
        <Grid.Column width={2}>
          <Checkbox
            toggle
            className="verbose-toggle"
            checked={cartoon.isFavorite}
            onClick={() => this.props.setFavorite(i)}
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

  render() {
    return (
      <Grid>
        <Grid.Row key="header" fluid>
          <Icon
            name="content"
            onClick={this.props.toggleVisibility}
            className="toggle-sidebar"
          />
          <h1>Choose your favorite XKCD comics!</h1>
        </Grid.Row>
        <Grid.Row key="headers" className="headers">
          <Grid.Column width={2}>Set As Favorite</Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={2}>Date</Grid.Column>
          <Grid.Column width={4}>Description</Grid.Column>
        </Grid.Row>
        {this.renderComics()}

        {this.props.isMoreData ? (
          <Grid.Row key="footer">
            <Grid.Column width={1}>
              <Button
                animated
                loading={this.props.isLoadingMore}
                onClick={
                  () => this.props.getMoreCartoons(this.props.lastCartoon) // kick off new request starting with last cartoon fetched
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
    );
  }
}

export default ViewCartoons;