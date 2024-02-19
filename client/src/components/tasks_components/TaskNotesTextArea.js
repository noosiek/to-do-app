// TaskNotesTextArea.js
import React from 'react';
import { MDBTextArea } from 'mdb-react-ui-kit';

const TaskNotesTextArea = ({ value, onChange }) => (
  <MDBTextArea
    rows={4}
    label='Dodaj notatkę'
    id='textAreaExample'
    name="notes"
    value={value}
    onChange={onChange}
  />
);

export default TaskNotesTextArea;
