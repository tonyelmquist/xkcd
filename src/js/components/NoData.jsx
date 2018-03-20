import React from 'react';
import noDataIcon from '../../assets/images/_noDataIcon.png';

const NoDataMessage = props => (
    <div>
        <div className="no-data-message">
            <img alt="no data icon" src={noDataIcon} />
            <h5>You haven't selected any favorites...</h5>
        </div>
    </div>
);

export default NoDataMessage;