import {useState} from 'react';

const BACKEND_URL = "http://localhost:3000";
// const BACKEND_URL = "https://qoala-ocr-assignment-production.up.railway.app";

export default function App() {

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [data, setData] = useState<string | null>(null);


  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setData(null);
    const selectedFile : any = e.target.files?.[0];
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
      const maxFileSizeMB = 2;
      if (fileSizeInMB > maxFileSizeMB) {
        throw new Error(
          "File size exceeds the limit (2MB). Please choose another image of smaller file size."
        );
      };
      if(selectedFile instanceof File) setFile(selectedFile);
  }

  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault();
    if(!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${BACKEND_URL}/detectText`, {
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
      <p>Upload an Image of Thai Id card to extract data.</p>

      <form className='flex items-center justify-center space-x-4' onSubmit={handleSubmit}>
        <input name='image' onChange={handleFileChange} type="file" accept="image/*" />
        <button className='px-5 py-1 rounded-md bg-blue-500 hover:bg-blue-600' type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploading && <p className='text-2xl'>Loading...</p>}

      {!uploading && data && (
        <pre
          className='text-white bg-black border-2 border-gray-300 py-4 px-6 rounded-lg w-full max-w-5xl overflow-auto'
        >
          JSON Data: {JSON.stringify(data, null, 4)}
        </pre>
      )}


    </main>
  )
}