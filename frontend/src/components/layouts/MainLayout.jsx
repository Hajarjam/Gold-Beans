import Navbar from "./Navbar";
import Footer from "./Footer";
//import CartButton from "../common/CartButton";


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}           
      </main>
      <Footer />
    </>
  ); 
}
