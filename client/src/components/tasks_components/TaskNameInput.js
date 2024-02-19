// TaskNameInput.js
import React from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

const TaskNameInput = ({ value, onChange }) => (
  <MDBInput label='Nazwij zadanie'
    required
    maxLength={30}
    name="title"
    value={value}
    onChange={onChange}
  />
);

export default TaskNameInput;
