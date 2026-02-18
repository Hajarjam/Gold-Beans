import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";//AuthContext : c’est ton “canal” de partage des infos auth dans toute l’application.
import publicApi from "../api/publicApi";


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);


  // Vérifie l'utilisateur courant au chargement du provider // dès que l’app démarre, on essaye de savoir si un user est déjà connecté (via localStorage + token).
  useEffect(() => {
    loadCurrentUser();
  }, []);


  async function loadCurrentUser() {
    try {
      const token = localStorage.getItem("authToken");//Tu stockes le token dans le navigateur sous la clé "authToken".//Si ton backend renvoie token, alors tu fais localStorage.setItem("authToken", token) après login.


      if (!token) {//Si ton backend renvoie token, alors tu fais localStorage.setItem("authToken", token) après login.
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }


      const isValid = await publicApi.verifyToken(token);//Tu fais une requête au backend pour vérifier que le token est encore valide.
      if (!isValid) {//Si le token n’est pas valide (ex: expiré), on le supprime et on considère que l’utilisateur n’est pas connecté.
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }


      const res = await publicApi.getCurrentUser(token);
      setUser(res.user);
      setRole(res.user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth Error:", error);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }


  async function logout() {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await publicApi.logout(token);
      }
    } catch (e) {
      // ignore errors
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        logout,
        refreshAuth: loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


































/*🎯 Situation réelle

Imaginons :

Tu as un site Coffee-Shop

Il y a un login

Il y a un dashboard admin

Il y a une navbar qui change si l’utilisateur est connecté

Ton AuthProvider est le cerveau central qui décide :

Est-ce que la personne est connectée ?
Qui est-elle ?
Quel est son rôle ?

🟢 CAS RÉEL 1 : L'utilisateur arrive sur le site
🔹 Étape 1 – Le site charge

React démarre → AuthProvider se monte → useEffect() s’exécute :

useEffect(() => {
  loadCurrentUser();
}, []);


👉 Ça veut dire :

"Avant d’afficher le site, je vérifie si quelqu’un est déjà connecté."

🔹 Étape 2 – On regarde dans le navigateur
const token = localStorage.getItem("authToken");

2 scénarios :
🔴 Scénario A : Aucun token

L’utilisateur n’a jamais connecté.

Résultat :

setIsAuthenticated(false);
setUser(null);


👉 Navbar affiche :
Login | Signup

👉 Dashboard inaccessible

🟢 Scénario B : Il y a un token

L’utilisateur s’est déjà connecté hier.

Donc :

const isValid = await publicApi.verifyToken(token);

Cas réel :

Si le token est expiré → logout automatique

Si le token est valide → on continue

🔹 Étape 3 – On récupère l’utilisateur
const res = await publicApi.getCurrentUser(token);


Le backend renvoie :

{
  "user": {
    "id": "123",
    "name": "Hiba",
    "role": "admin"
  }
}


Donc React fait :

setUser(res.user);
setRole("admin");
setIsAuthenticated(true);


👉 Navbar devient :
Bienvenue Hiba | Logout

👉 Dashboard admin accessible

🟢 CAS RÉEL 2 : L'utilisateur vient de se connecter
Étape 1 – Elle fait Login

Backend renvoie :

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}


Tu fais :

localStorage.setItem("authToken", token);

Étape 2 – Tu appelles :
await refreshAuth();


⚡ refreshAuth = loadCurrentUser()

Donc :

Il lit le token

Il le valide

Il récupère le user

Il met isAuthenticated = true

👉 L’interface change automatiquement.

🔴 CAS RÉEL 3 : Le token expire

L’utilisateur revient après 3 heures.

verifyToken() retourne false.

Ton code fait :

localStorage.removeItem("authToken");
setIsAuthenticated(false);


👉 Il est automatiquement déconnecté.

Très sécurisé 🔐

🟢 CAS RÉEL 4 : Logout

Quand elle clique sur Logout :

logout()


Ce qui se passe :

Backend invalide la session (optionnel)

Token supprimé

user = null

isAuthenticated = false

👉 React rerender immédiatement. */