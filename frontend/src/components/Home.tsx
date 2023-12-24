import { useState, useEffect } from 'react';
const API_URL = "http://localhost:3000";

const Home = () => {
  const [records, setRecords] = useState([]);

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
    <div>
      <h1>Records List</h1>
      <ul>
        {records.map((record) => (
          <li key={record._id}>
            <strong>Id:</strong> {record._id}, <strong>Name:</strong> {record.name}, <strong>Last Name:</strong> {record.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
