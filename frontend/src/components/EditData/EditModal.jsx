import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const EditTodoModal = ({ isOpen, onClose, onSave, defaultText }) => {
  const [editedText, setEditedText] = useState(defaultText);

  const handleSave = () => {
    onSave(editedText);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Todo Modal"
      className="modal w-full max-w-2xl mx-auto m-20 bg-white rounded-lg shadow-lg outline-none focus:outline-none overflow-auto"
    >
      <h2 className='p-2 bg-blue-100'><center>Edit Todo</center></h2>

      <center><input
      className='mt-2 p-2 border-2 border-blue-200 rounded-lg h-24 w-3/4'
        type="text"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
      /></center>
      <br />
      <center className='pb-4'>
        <button className='bg-green-500 mx-2 py-1 px-3 rounded hover:bg-green-600' onClick={handleSave}>Save</button>
        <button className='bg-red-500 mx-2 py-1 px-3 rounded hover:bg-red-600' onClick={onClose}>Cancel</button>
      </center>
    </Modal>
  );
};

export default EditTodoModal;
