import { useState, useEffect } from 'react';
const API_URL = "http://localhost:3000";

const Home = () => {
  const [records, setRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete(e: React.FormEvent) {
    e.preventDefault();
  
    // Assuming you have the record ID stored in a variable called recordId
    const recordId = 'your_record_id'; // Replace with the actual record ID
  
    fetch(`http://your-api-base-url/deleteRecord/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if needed
      },
      // You can include a body if necessary
      // body: JSON.stringify({ key: 'value' }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Deleted Record:', data.deletedRecord);
        // Handle the response or perform additional actions
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        // Handle errors or display an error message
      });
  }
  

  function handleEdit (e: React.FormEvent) { 
    e.preventDefault();
    console.log("edit");
  }

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/getAllRecords`);
        console.log(response);
        
        const data = await response.json();

        if (response.ok) {
          setRecords(data.records);
        } else {
          console.error(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-blue-100'>
      <h1 className='font-bold text-xl py-8 text-blue-800'>Records List</h1>
      <ul className='space-y-2 rounded p-12'>
        {records.map((record) => (
          <li key={record._id} className='flex space-x-4'>
            <div className='bg-red-800 rounded p-4'>
              <div><strong>Id:</strong> {record._id}</div>
              <div><strong>Name:</strong> {record.name}</div>
              <div><strong>Last Name:</strong> {record.lastName}</div>
              <div><strong>Identification Number:</strong> {record.identificationNumber}</div>
              <div><strong>Date of Birth:</strong> {record.dateOfBirth}</div>
              <div><strong>Date of Issue:</strong> {record.dateOfIssue}</div>
              <div><strong>Date of Expiry:</strong> {record.dateOfExpiry}</div>
            </div>
            <div><button className='bg-blue-500 py-1 px-3 rounded hover:bg-blue-600' onClick={() => handleEdit(record._id)}>edit</button></div>
            <div><button className='bg-red-500 py-1 px-3 rounded hover:bg-red-600' onClick={() => handleDelete(record._id)}>delete</button></div>
            <div><button className='bg-green-500 py-1 px-3 rounded hover:bg-green-600'>save</button></div>
          </li>

          
        ))}
      </ul>
    </div>
  );
};

export default Home;
