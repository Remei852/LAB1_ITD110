import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CSVUpload from "./components/CSVUpload";
import StudentDashboard from './components/StudentDashboard';
import Header from "./components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = 'http://localhost:5000/students';

const initialFormState = {
  id: '',
  name: '',
  age: '',
  gender: '',
  course: '',
  birthdate: '',
  phone: '',
  email: '',
  address: ''
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("name");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  
  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students!');
    }
  };


  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setFormData(initialFormState); // Reset form data to empty state
    setIsAddModalOpen(true);
  };

   // Add new student
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      toast.success('Student added successfully!');
      setFormData(initialFormState); // Reset form after successful add
      await fetchStudents();
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Error adding student!');
    }
  };


  // Update existing student
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${formData.id}`, formData);
      toast.success('Student updated successfully!');
      await fetchStudents();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Error updating student!');
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Student deleted!');
      await fetchStudents();
    } catch (error) {
      toast.error('Error deleting student!');
    }
  };

  // Populate form for updating student
  const handleEdit = (student) => {
    setFormData(student);
    setIsEditModalOpen(true);
  };

  // Handle CSV upload success
  const handleCSVUploadSuccess = async () => {
    await fetchStudents();
    setShowCSVModal(false);
    toast.success('CSV data loaded successfully!');
  };

  // SEARCH FUNCTION
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);

    const filtered = students.filter((item) => {
      return item[searchAttribute]?.toString().toLowerCase().includes(query);
    });

    setFilteredStudents(filtered);
  };

  // Clear Search function
  const handleClearSearch = () => {
    setSearch('');
    setFilteredStudents(students);
  };

  return (
    <div className='con'>
      <Header 
        search={search} 
        setSearch={setSearch} 
        searchAttribute={searchAttribute} 
        setSearchAttribute={setSearchAttribute}
        handleSearch={handleSearch} 
        handleClearSearch={handleClearSearch}
      />
       <div className='container'>
        <div className="up">
          <h2>Student List</h2>
          <div className="button-group">
            <button 
              className="dashboard-toggle" 
              onClick={() => setShowDashboard(!showDashboard)}
            >
              {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
            </button>
            <button className="add-btn" onClick={handleOpenAddModal}>Add Student Manually</button>
            <button 
              className="upload-button" 
              onClick={() => setShowCSVModal(true)}
            >
              Upload CSV
            </button>
              <CSVUpload 
              showModal={showCSVModal} 
              setShowModal={setShowCSVModal} 
              onUploadSuccess={handleCSVUploadSuccess} 
            />

          </div>
        </div>
       
        <div className="table-wrapper">
          <table className="students-table" align="center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Birthdate</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                [...filteredStudents].sort((a, b) => a.id - b.id)
                .map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.gender}</td>
                    <td>{student.course}</td>
                    <td>{student.birthdate}</td>
                    <td>{student.phone}</td>
                    <td>{student.email}</td>
                    <td>{student.address}</td>
                    <td>
                      <button onClick={() => handleEdit(student)}>Edit</button>
                      <button onClick={() => handleDelete(student.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" align="center">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
        {/* Add Student Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close" onClick={() => setIsAddModalOpen(false)}>&times;</span>
              <h2>Add Student</h2>
              <form onSubmit={handleAddSubmit}>
                <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
                <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
                <input type="date" name="birthdate" placeholder="Birthdate" value={formData.birthdate} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone no." value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" title="Enter a 10-digit phone number" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
        )}
        
        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
              <h2>Edit Student</h2>
              <form onSubmit={handleEditSubmit}>
                <input type="text" name="id" placeholder="ID" value={formData.id} disabled />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
                <input type="text" name="course" placeholder="Course" value={formData.course} onChange={handleChange} required />
                <input type="date" name="birthdate" placeholder="Birthdate" value={formData.birthdate} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone no." value={formData.phone} onChange={handleChange}pattern="[0-9]{10}" title="Enter a 10-digit phone number" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                <button type="submit">Update</button>
              </form>
            </div>
          </div>
        )}
        
        {showDashboard && (
            <div className="dashboard-container mb-6">
              <StudentDashboard students={students} />
            </div>
          )}
      
      <ToastContainer />
    </div>
    
  );
}

export default App;