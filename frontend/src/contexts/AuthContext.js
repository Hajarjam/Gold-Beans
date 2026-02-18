import { createContext } from "react";


const AuthContext = createContext(null); //Il crée un contexte global d’authentification. // null : valeur par défaut (utilisateur non connecté)


export default AuthContext;


/*Grâce à lui, tu peux accéder partout dans l’application à :

l’utilisateur connecté

le token JWT

les fonctions login, logout

le rôle (admin / client)

Sans avoir à passer les props manuellement 

*/