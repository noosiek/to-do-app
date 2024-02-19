import React, { useState } from 'react';
import ShowModal from './Modal';
import { MDBBtn,MDBIcon } from 'mdb-react-ui-kit';
import TaskProgress from './tasks_components/TaskProgress';

const DoingList = ({ task, getData, moveToComponent }) => {
  const [showModal, setShowModal] = useState(null);

  const deleteItem = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const editTask = async () => {};
    if (task.status === 'doing') {
      try {
        const updatedTask = { ...task, status: 'done', progress: 100 };
        const response = fetch(`${process.env.REACT_APP_SERVERURL}/todos/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });

        if (response.status === 200) {
          getData();
          // Po zaktualizowaniu statusu zadania, przenieś je do komponentu DoneList
          moveToComponent('DoneList', task);
        }
      } catch (error) {
        console.error(error);
      }
    };

  if (task.status !== 'done') {
    // Jeśli status zadania nie jest 'doing', nie renderuj tego komponentu
    return null;
  }
  const categoryIcons = {
    work: <MDBIcon fas icon="briefcase" style={{padding: "10px"}} />,
    home: <MDBIcon fas icon="home" style={{padding: "10px"}}/>,
    study: <MDBIcon fas icon="user-graduate" style={{padding: "10px"}} />,
  };
  
  const categoryIcon = task.task_category ? categoryIcons[task.task_category.toLowerCase()] : null;

  return (
    <li className="list-item">
      <div className="info-container">
        {categoryIcon}
        <p className="task-title">{task.title}</p>
        </div>
        <div className='task-progress-container done-container'>
        <TaskProgress progress={task.progress} />
        </div>
      <div className="button-container">
      <MDBBtn color='warning' className='mx-2' style={{ minWidth: '50px',}} onClick={() => setShowModal(true)}>
      <MDBIcon fas icon="edit" />
      </MDBBtn>

      <MDBBtn color='danger' className='mx-2' style={{ minWidth: '50px' }} onClick={deleteItem}>
      <MDBIcon fas icon="trash-alt" />
      </MDBBtn>
      </div>
      {showModal && (
        <ShowModal
          mode={'edit'}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  );
};

export default DoingList;
