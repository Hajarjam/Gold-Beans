import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import publicApi from "../../../api/publicApi";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
   const navigate = useNavigate();
  {
    /* post   Elles sont envoyées au serveur (Node / Express) */
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await publicApi.register({
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation,
        role: "client",
      });
      setSuccess("Compte créé ! Vérifiez votre email pour l'activation.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(err?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-peach-light text-brown font-sans overflow-hidden">
      <header className="h-10 flex items-center items-stretch justify-between px-7 max-[980px]:px-4 py-10">
        <div className="flex items-center gap-1 min-w-[180px]">
          <div
          onClick={()=>navigate('/')}
            className="w-35 h-16 flex items-center justify-center cursor-pointer"
            aria-hidden="true"
          >
            <img
              src="/assets/logo2.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1180px] mx-auto mt-3.5 mb-10 px-6 py-6 bg-brown/10  rounded-[5px]">
        <section className="grid grid-cols-[1.1fr_.9fr] gap-10 items-stretch max-[980px]:grid-cols-1">
          <div className="rounded-[10px] overflow-hidden shadow-soft">
            <img
              src="/assets/coffee.svg"
              alt="Coffee beans pack"
              className="w-full h-[700px] block object-cover min-h-[520px] max-[980px]:min-h-[340px]"
            />
          </div>

          <div className="flex flex-col gap-3 justify-center h-[700px]  py-1.5 ">
            <h1 className="font-display font-instrument-serif text-center text-[50px] leading-[1.05] tracking-[.4px] mb-6 max-[980px]:text-[60px] t">
              Create Account
            </h1>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                {success}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <input
                className={`w-full h-12 border border-brown rounded-[5px] px-3.5 bg-peach-light outline-none  placeholder:text-brown/60 focus:border-brown focus:ring-4 focus:ring-brown/30`}
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
              {/*Chaque fois que l’utilisateur écrit, on récupère le texte et on le stocke dans une variable React.   // Quand loading === true  le champ est désactivé   l’utilisateur clique sur “S’inscrire” loading = true */}

              <input
                className={`w-full h-12 border border-brown rounded-[5px] px-3.5 bg-peach-light outline-none  placeholder:text-brown/60 focus:border-brown focus:ring-4 focus:ring-brown/30`}
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />

              <input
                className={`w-full h-12 border border-brown rounded-[5px] px-3.5 bg-peach-light outline-none  placeholder:text-brown/60 focus:border-brown focus:ring-4 focus:ring-brown/30`}
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <input
                className={`w-full h-12 border border-brown rounded-[5px] px-3.5 bg-peach-light outline-none  placeholder:text-brown/60 focus:border-brown focus:ring-4 focus:ring-brown/30`}
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <input
                className={`w-full h-12 border border-brown rounded-[5px] px-3.5 bg-peach-light outline-none  placeholder:text-brown/60 focus:border-brown focus:ring-4 focus:ring-brown/30 `}
                placeholder="Confirmer le mot de passe"
                value={passwordConfirmation}
                type="password"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />

              <button
                className="w-full h-[50px] mt-1.5 border border-brown rounded-[5px]  bg-brown text-peach-light  tracking-[.6px] hover:bg-[#BB9582] hover:text-brown"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sign up..." : "Sign up"}
              </button>

              <div className="flex items-center gap-3.5 my-[18px] text-[13px] text-brown">
                <span className="h-px bg-brown/25 flex-1" />
                <span>or</span>
                <span className="h-px bg-brown/25 flex-1" />
              </div>

              <div className="flex justify-center items-center gap-6 mt-2 mb-4">
                <button
                  type="button"
                  className="group w-12 h-12 rounded-full border border-brown/25 bg-brown grid place-items-center hover:bg-peach-light transition-colors"
                  aria-label="Continue with Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current text-white group-hover:text-brown transition-colors"
                  >
                    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6H16.7V4.9c-.3 0-1.4-.1-2.7-.1-2.6 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="group w-12 h-12 rounded-full border border-brown/25 bg-brown grid place-items-center hover:bg-peach-light transition-colors"
                  aria-label="Continue with Apple"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current text-white group-hover:text-brown transition-colors"
                  >
                    <path d="M16.7 13.2c0-2 1.6-3 1.7-3.1-1-1.5-2.5-1.7-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.7-.8-1.4 0-2.7.8-3.4 2.1-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.6 2.7-.6 1.2 0 1.6.6 2.7.6 1.1 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.1-2.2-.1 0-2.1-.8-2.1-3.7z" />
                    <path d="M14.9 6.7c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.7-1.1 1.7-.9 2.7 1 0 1.9-.5 2.5-1.3z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="group w-12 h-12 rounded-full border border-brown/25 bg-brown grid place-items-center hover:bg-peach-light transition-colors"
                  aria-label="Continue with Google"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current text-white group-hover:text-brown transition-colors"
                  >
                    <path d="M21.6 12.3c0-.7-.1-1.2-.2-1.8H12v3.4h5.4c-.1.9-.8 2.3-2.3 3.2l-.1.4 2.9 2.2.2 0c2-1.9 3.1-4.7 3.1-7.6z" />
                    <path d="M12 22c2.7 0 5-0.9 6.7-2.5l-3.2-2.4c-.9.6-2 .9-3.5.9-2.6 0-4.8-1.7-5.6-4.1l-.4 0-3 2.3 0 .3C4.6 19.6 8 22 12 22z" />
                    <path d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9l0-.4-3-2.3-.3.1C2.4 9 2 10.4 2 12s.4 3 1.1 4.3l3.3-2.4z" />
                    <path d="M12 6.9c1.9 0 3.1.8 3.8 1.5l2.8-2.7C17 4.1 14.7 3 12 3 8 3 4.6 5.4 3.1 8.7l3.3 2.4C7.2 8.6 9.4 6.9 12 6.9z" />
                  </svg>
                </button>
              </div>

              <div className="text-center text-[18px] text-brown/80">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-brown font-instrument no-underline hover:underline"
                >
                  Log in
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
