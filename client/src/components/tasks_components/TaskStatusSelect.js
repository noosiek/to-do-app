// TaskStatusSelect.js
import React from 'react';
import Form from 'react-bootstrap/Form';

const TaskStatusSelect = ({ value, onChange }) => (
  <Form.Select name="status" id="status" value={value} onChange={onChange}>
    <option value="todo">Do zrobienia</option>
    <option value="doing">W trakcie realizacji</option>
    <option value="done">Zakończone</option>
  </Form.Select>
);

export default TaskStatusSelect;
