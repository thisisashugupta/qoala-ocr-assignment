import { useState, useEffect } from 'react';
const API_URL = "http://localhost:3000";

const Home = () => {
  const [records, setRecords] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

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
      } catch (error : any) {
        console.error(`Error: ${error.message}`);
      }
    };

    fetchRecords();
  }, [isDeleting]);

  async function handleDelete(recordId : any) {  
    setIsDeleting(true);
    await fetch(`${API_URL}/deleteRecord/${recordId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Deleted Record:', data.deletedRecord);
        // Handle the response or perform additional actions
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
      });
      setIsDeleting(false);
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div><p className='mt-12'>Previous OCR Results</p></div>
      <ul className='space-y-2 rounded p-12 mt-12'>
        {records.map((record : any) => (
          <li key={record._id} className='flex items-center space-x-4'>
            <div className='rounded p-4'>
              <div>
                <strong>Name:</strong> {record.name}
              </div>
              <div>
                <strong>Last Name:</strong> {record.lastName}
              </div>
              <div>
                <strong>Identification Number:</strong> {record.identificationNumber}
              </div>
              <div>
                <strong>Date of Birth:</strong> {record.dateOfBirth}
              </div>
              <div>
                <strong>Date of Issue:</strong> {record.dateOfIssue}
              </div>
              <div>
                <strong>Date of Expiry:</strong> {record.dateOfExpiry}
              </div>
              <div>
                <strong>Id:</strong> {record._id}
              </div>
            </div>
            <div><button className='bg-blue-500 py-1 px-3 rounded hover:bg-blue-600'>Edit</button></div>
            <div><button className='bg-red-500 py-1 px-3 rounded hover:bg-red-600' onClick={() => handleDelete(record._id)}>Delete</button></div>
            
          </li>

          
        ))}
      </ul>
    </div>
  );
};

export default Home;
