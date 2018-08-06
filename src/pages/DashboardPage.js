import React from 'react';
import AccountGroup from '../components/AccountGroup';
import Account from '../components/Account';

class DashboardPage extends React.Component {
  state = {
    edit: false,
  }

  render() {
    const { edit } = this.state;
    return (
      <div>
        <div className="mb-4 text-xl font-bold">
          Dashboard
        </div>
        <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded mb-4 mr-4">
          Balance
        </button>
        <button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded" onClick={() => this.setState({ edit: !this.state.edit })}>
          { !edit ? <span>Edit Groups</span> : <span>Stop Editing</span> }
        </button>
        <AccountGroup
          name="Retirement"
          slices={[
            {
              color: '#1F9D55',
              value: 10,
            },
            {
              color: '#38C172',
              value: 20,
            },
            {
              color: '#51D88A',
              value: 15,
            },
            {
              color: '#A2F5BF',
              value: 20,
            },
            {
              color: '#E3FCEC',
              value: 15,
            }
          ]}
        >
          <Account name="Mike RRSP" edit={edit} />
          <Account name="Stacy RRSP" edit={edit} />
          <Account name="Mike TFSA" edit={edit} />
          <Account name="Stacy TFSA" edit={edit} />
          <Account name="Non-Registered" edit={edit} />
        </AccountGroup>
        <AccountGroup
          name="RESP"
          slices={[
            {
              color: '#1F9D55',
              value: 10,
            }
          ]}
        >
          <Account name="Megan RESP" edit={edit} />
        </AccountGroup>
      </div>
    );
  }
}

export default DashboardPage;
