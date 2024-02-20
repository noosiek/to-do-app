import React, { useEffect, useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import ListHeader from './components/listHeader';
import ListItem from './components/ListItem';
import Auth from './components/Auth';
import DoingList from './components/DoingList';
import DoneList from './components/DoneList';
import { MDBContainer } from 'mdb-react-ui-kit';


const App = () => {
  const [tasks, setTasks] = useState(null);
  const [cookies] = useCookies(['user']);

  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;

  const getData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`);
      if (response.status === 200) {
        const json = await response.json();
        setTasks(json);
      }
    } catch (error) {
      console.error(error);
    }
  }, [userEmail]); 

  useEffect(() => {
    if (authToken && userEmail) {
      getData();
    }
  }, [authToken, userEmail, getData]);

  const sortedTasks = tasks?.slice().sort((a, b) => b.progress - a.progress);

  return (
    <div className="app">
      {!authToken && <Auth inputStyle={{ backgroundColor: 'white'}} />}
      {authToken && (
        <>
          <p className="user-email">Witaj ponownie, {userEmail}</p>
          <ListHeader listName={'Lista zadań'} getData={getData} />
          
          <div>
            <p className="header-title">DO ZROBIENIA</p>
            {sortedTasks?.map((task) => (
              <ListItem key={task.id} task={task} getData={getData} />
            ))}
            {sortedTasks?.length === 0 && (
              <MDBContainer className="empty-container">
                <p>No tasks added yet.</p>
              </MDBContainer>
            )}
          </div>

          <div>
            <p className="header-title">W TRAKCIE</p>
            {sortedTasks?.map((task) => (
              <DoingList key={task.id} task={task} getData={getData} />
            ))}
            {sortedTasks?.length === 0 && (
              <MDBContainer className="empty-container">
                <p>No tasks in progress.</p>
              </MDBContainer>
            )}
          </div>

          <div>
            <p className="header-title">ZROBIONE</p>
            {sortedTasks?.map((task) => (
              <DoneList key={task.id} task={task} getData={getData} />
            ))}
            {sortedTasks?.length === 0 && (
              <MDBContainer className="empty-container">
                <p>No completed tasks.</p>
              </MDBContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;