import {Link} from 'react-router-dom';

export default function Header() {
    return (
    <div className="fixed left-0 top-0 flex w-full items-center justify-between px-16 border-b border-gray-300 py-4 bg-white">
        <Link to="https://www.qoala.app/id-en" target='_blank'><img src="public/Qoala-logo.png" alt="Qoala" width={120}/></Link>
        <p className='font-thin text-xl'>OCR Assignment</p>
        <div className="inline-flex">
            <Link to="/">
                <button className="bg-gray-200 hover:bg-orange-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                    Home
                </button>
            </Link>
            <Link to="/api">
                <button className="bg-gray-200 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                    API
                </button>
            </Link>
        </div>
    </div>
        
    );
}
