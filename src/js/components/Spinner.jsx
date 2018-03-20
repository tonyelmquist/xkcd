import { Dimmer, Loader } from 'semantic-ui-react';
import React from 'react';

import PropTypes from 'prop-types';

const Spinner = props => (
    <Dimmer active inverted>
        <Loader size="large">{props.text}</Loader>
    </Dimmer>
);

Spinner.defaultProps = {
    text: 'Loading...',
};


Spinner.propTypes = {
    text: PropTypes.string,
};

export default Spinner;
