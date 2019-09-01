import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
    data: [],
    id: 0,
    msg: null,
    intervalSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount() {
    if(!this.state.intervalSet) {
      let interval = setInterval(this.getDataFromDB, 1000);
      this.setState({ intervalSet: interval })
    }
  }

  componentWillUnmount() {
    if(this.state.intervalSet) {
      clearInterval(this.state.intervalSet);
      this.setState({ intervalSet: null});
    }
  }

  getDataFromDB = () => {
    fetch('http://localhost:3001/api/getData')
    .then((data) => data.json())
    .then((res) => this.setState({ data: res.data }));
  };

  putDataToDB = (msg) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while(currentIds.includes(idToBeAdded)) {
      idToBeAdded++;
    }

    axios.post('http://localhost:3001/api/putData', {
    id: idToBeAdded,
    msg: msg,
    });
  };

  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if(dat.id == idToDelete) {
        objIdToDelete = dat._id;
      }
    });
    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate= null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if(dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
    id: objIdToUpdate,
    update: { msg: updateToApply}
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0
          ? 'No DB ENTRIES YET'
          : data.map((dat) => (
            <li style = {{ padding: '10px'}} key={dat.msg}>
              <span style = {{ color: 'gray' }}>id: </span> {dat.id} <br />
              <span style = {{ color: 'gray'  }}>data: </span> {dat.msg}
            </li>
          ))}
        </ul>
        <div style={{ padding: '10px'  }}>
          <input
            type="text"
            onChange={(e) => this.setState({msg: e.target.value })}
            placeholder="add something in the database"
            style={{  width: '200px'  }}
          />
          <button onClick={() => this.putDataToDB(this.state.msg)}>
            ADD
          </button>
        </div>
        <div style = {{  padding: '10px'  }}>
          <input
          type="text"
          onChange={(e) => this.setState({idToDelete: e.target.value })}
          placeholder="put id of item to delete here"
          style={{  width: '200px'  }}
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>

        <div style={{  padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({idToUpdate: e.target.value })}
            placeholder="put id of item to update here"
            style={{  width: '200px'  }}
            />
          <input
            type="text"
            onChange={(e) => this.setState({updateToApply: e.target.value })}
            placeholder="put new value of the item here"
            style={{  width: '200px'  }}
            />

          <button
          onClick={() =>
            this.updateDB(this.state.idToUpdate, this.state.updateToApply)
          }
          >
            UPDATE
          </button>
        </div>
      </div>
    )
  }

}

export default App;
