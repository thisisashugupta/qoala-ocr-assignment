import Header from './components/Header/Header.tsx';
import Footer from './components/Footer/Footer.tsx';
import {Outlet} from 'react-router-dom';

export default function Layout() {
    return ( 
    <>
    {/* <Header /> */}
    <Outlet />
    <Footer />
    </> 
    );
}