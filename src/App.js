import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', grade: '' });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = 'http://localhost:5656';
  const STUDENT_ENDPOINT = '/student/';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${STUDENT_ENDPOINT}`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}${STUDENT_ENDPOINT}`, newStudent);
      fetchStudents();
      setNewStudent({ id: '', name: '', grade: '' });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };
  const handleUpdateChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}${STUDENT_ENDPOINT}${currentStudent.id}`, currentStudent);
      fetchStudents();
      setCurrentStudent(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const openModal = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentStudent(null);
  };

  return (
    <div>
      <h1>Students</h1><form onSubmit={handleAddStudent} className="mb-3">
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={newStudent.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="grade"
            className="form-control"
            placeholder="Grade"
            value={newStudent.grade}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Student</button>
      </form>
      {showModal && (
        <div>
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Student</h5>
                <button type="button" className="close" onClick={closeModal}>&times;</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      value={currentStudent.name}
                      onChange={handleUpdateChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="grade"
                      className="form-control"
                      placeholder="Grade"
                      value={currentStudent.grade}
                      onChange={handleUpdateChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Student</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
        </div>
      )}

      <ul className="list-group">
        {students.map((student) => (
          <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
            {student.name} - Grade: {student.grade}
            <button className="btn btn-secondary" onClick={() => openModal(student)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
