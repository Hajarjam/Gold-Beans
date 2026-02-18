
import DarkNavbar from "../common/DarkNavbar";
import Footer from "../common/Footer";
export default function PeachLayout({ children }) {
  return (
    <>
      <div className="min-h-screen bg-peach-light">
        <DarkNavbar /> 
       
        {children}
        <Footer />
      </div>
    </>
  );
}
