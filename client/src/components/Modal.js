import React, { useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBBtn} from 'mdb-react-ui-kit';
import TaskCategorySelect from './tasks_components/TaskCategorySelect';
import TaskNameInput from './tasks_components/TaskNameInput';
import TaskNotesTextArea from './tasks_components/TaskNotesTextArea';
import TaskProgress from './tasks_components/TaskProgress';
import TaskStatusSelect from './tasks_components/TaskStatusSelect';




const Modal = ({ mode, setShowModal, getData, task }) => {
  const [cookies] = useCookies(['user']);
  const [basicModal, setBasicModal] = useState(true);
  const progressBarRef = useRef(null);
  const editMode = mode === 'edit';

  const initialData = {
    user_email: cookies.Email,
    title: editMode && task.title ? task.title : 'Tytuł zadania',
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : null,
    notes: editMode ? task.notes : '',
    status: 'todo',
    task_category: editMode ? task.task_category : 'work',
    due_date: editMode ? task.due_date : null
  };
  const [data, setData] = useState(initialData);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleChangeOfProgress = (event) => {
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const newProgress = Math.round(((event.clientX - left) / width) * 100);
    setData(prevData => ({ ...prevData, progress: Math.max(0, Math.min(100, newProgress)) }));
  };
  
  
  const postData = async () => {
    const formattedData = {
      ...data,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editData = async () => {
    const formattedData = {
      ...data,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/api/todos/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const toggleOpen = () => {
    setBasicModal(!basicModal);
    setShowModal(!basicModal);
  };

  return (
    <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{mode === 'edit' ? 'Edytuj' : 'Dodaj'} swoje zadanie</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <TaskNameInput value={data.title} onChange={handleChange} />
              <label>Postęp zadania</label>
            <TaskProgress progress={data.progress} onClick={handleChangeOfProgress} progressBarRef={progressBarRef} />
            <TaskNotesTextArea value={data.notes} onChange={handleChange} />
              <label>Status zadania:</label>
            <TaskStatusSelect value={data.status} onChange={handleChange} />
              <label htmlFor="task_category">Kategoria zadania:</label>
            <TaskCategorySelect value={data.task_category} onChange={handleChange} />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='danger' onClick={toggleOpen}>
              Zamknij
            </MDBBtn>
            <MDBBtn
              className={mode}
              type="submit"
              onClick={editMode ? editData : postData}>
              {editMode ? 'Zapisz zmiany' : 'Dodaj zadanie'}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default Modal;
