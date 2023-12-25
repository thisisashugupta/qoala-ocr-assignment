import {useState} from 'react';

export default function App() {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [data, setData] = useState<string | null>(null);


  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if(selectedFile instanceof File) setFile(selectedFile);
  }

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    if(!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/detectText", {
        method: "POST",
        body: formData
      });

      const responseData = await response.json();
      setData(responseData);

    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">

      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 pb-6 pt-8">
        Qoala OCR Assignment
      </p>

      <form className='flex items-center justify-center space-x-4' onSubmit={handleSubmit}>
        <input className='border-2 border-white p-2 rounded-lg' name='image' onChange={handleFileChange} type="file" accept="image/*" />
        <button className='border-2 border-white p-2 rounded-lg' type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    
      {data && <pre className='border-2 border-white py-4 px-6 rounded-lg w-full max-w-5xl'>JSON Data: {JSON.stringify(data, null, 4)}</pre>}

    </main>
  )
}