import React from 'react';
import PropTypes from 'prop-types';

const Account = (props) => {
  return (
    <div className="flex py-2">
      <div className="w-1/4 bg-white py-1 align-middle">{props.account.meta.type} {props.account.number}</div>
      <div className="w-3/4 bg-white py-1 align-middle">
        <div>
          {props.balances
            && props.balances.data
            && props.balances.data.map(balance => (
              <span>{balance.currency.name}: {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(balance.cash)}&nbsp;</span>
            ))
          }
        </div>
        <div>
          {props.positions
            && props.positions.data
            && props.positions.data.map(position => (
              <div key={position.id} >
                <span title={position.symbol.description}>{position.symbol.symbol.symbol}</span> - {position.units} - {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(position.price * position.units)}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

Account.defaultProps = {
  account: PropTypes.object,
}

export default Account;
