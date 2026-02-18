export default function Footer() {
  return (
    <footer className="bg-brown text-white py-10 px-6 font-instrument-sans mt-10">

      {/* Container for all parts */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 max-w-6xl mx-auto">

        {/* Part 1: Logo + text */}
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 md:w-1/4">
  <img src="/assets/logo.png" alt="Brand logo" className="h-16 w-auto md:h-20 opacity-50" />
  <p className="opacity-75 text-sm md:text-sm leading-snug max-w-[200px] md:max-w-[300px]">
    Premium coffee subscriptions, roasted fresh and delivered to your door.
  </p>
</div>


        {/* Part 2: Support links */}
        <div className="flex flex-col gap-2 md:w-1/6">
          <p className="font-bold mb-2">Support</p>
          <a href="#home" className="hover:underline">How It Works</a>
          <a href="#home" className="hover:underline">FAQ</a>
          <a href="#home" className="hover:underline">Delivery & Returns</a>
        </div>

        {/* Part 3: Contact */}
        <div className="flex flex-col gap-2 md:w-1/6">
          <p className="font-bold mb-2">Contact</p>
          <a href="#home" className="hover:underline">Rabat, Morocco</a>
          <a href="#home" className="hover:underline">support@brewly.com</a>
        </div>

        {/* Part 4: Legal */}
        <div className="flex flex-col gap-2 md:w-1/6">
          <a href="#home" className="hover:underline">Privacy Policy</a>
          <a href="#home" className="hover:underline">Terms & Conditions</a>
        </div>

        {/* Part 5: Social */}
        <div className="flex flex-col gap-2 md:w-1/6">
          <p className="font-robotoSerif font-semibold mb-2">Follow Us:</p>
          <div className="flex gap-4 opacity-75">
            <img src="/assets/facebook.png" alt="facebook" className="w-10 h-10" />
            <img src="/assets/instagram.png" alt="instagram" className="w-10 h-10" />
            
          </div>
          {/* COPYRIGHT */}
          <p className="text-xs text-opacity-75 mt-4 text-center">
            © 2026 Brewly. All rights reserved.
          </p>
        </div>

      </div>

    </footer>
  );
}
