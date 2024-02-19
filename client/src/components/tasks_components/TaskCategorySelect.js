import React from 'react';
import Form from 'react-bootstrap/Form';

const TaskCategorySelect = ({ value, onChange }) => (
  <Form.Select name="task_category" id="task_category" value={value} onChange={onChange}>
    <option value="study">Nauka</option>
    <option value="work">Praca</option>
    <option value="home">Obowiązki domowe</option>
  </Form.Select>
);

export default TaskCategorySelect;
