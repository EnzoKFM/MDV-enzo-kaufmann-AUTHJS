# Choix Techniques liés au projet d'Authentification

## Authentification

### Couple Username/Password
J'ai choisi d'utiliser un couple Username Password afin de permettre un meilleur accès général via la base de données. Même si OAuth2 est plus sécurisé, j'ai préféré partir sur l'idée d'être une entreprise avec sa propre base de données, et de ne pas utiliser les comptes googles pour que cela soit simple. De plus, si on regarde le scénario, on va avoir différents roles et des personnes différentes. Dans ce cas la, le protocole d'authentification peut être plus intéressant que le protocole d'autorisation OAuth2

### OTP
J'ai choisi donc d'utiliser l'OTP avec Google Authenticator afin d'accéder à la page de la liste des Intervenants afin de le sécuriser. Pour ça, une page "verify" qui permettra d'ajouter l'OTP ou de mettre le code, et en cas de validation, se connecter à la page.

## Base de Données

### MySQL

J'ai décidé d'utiliser MySql car je souhaitais avoir une base de données relationnel avec des tables statiques. Cela me permet de pouvoir définir exactement ce que je souhaite dans ma table "user" et je trouve donc ça plus pratique.

## Développement

### JS + Node

J'ai choisi de ne pas forcément aller chercher le TypeScript et de rester sur du JavaScript afin de ne pas me perdre entre les deux langages, en plus d'utiliser donc Node qui nous permettra une bonne flexibilité

==============================================================================
==============================================================================

# Structure de l'Authentification

## Dashboard
J'ai décide de structurer l'authentification de la même manière que nous avons fait pendant cette semaine, c'est-a-dire une page "s'inscrire" et une page "login". Dès que nous sommes connectés, nous nous rendons sur la page "Dashboard".
Ici, tout va dépendre du role qu'a l'utilisateur. 
- S'il a le rôle "etudiant", alors il ne pourra avoir accès qu'a la page "etudiantDetails", qui lui permet d'avoir son username et son rôle.
- S'il a le rôle "intervenant", alors il ne pourra avoir accès qu'a la page "etudiantsList", qui lui permet d'avoir une liste des différents utilisateurs ayant le rôle "etudiant"
- S'il a le rôle "admin", alors il aura accès à la page "etudiantsList", "intervenantsList" (qui permet d'avoir une liste des différents utilisateurs) et à la page "adminPanel"

## Panneau d'Administration
La page "adminPanel" permet d'avoir une liste de tous les utilisateurs avec l'ID, le username, le rôle, et également une liste de sélection et un bouton "Modifier". Cela permet de pouvoir, depuis le site, directement changer le rôle des utilisateurs.
Nous ne pouvons changer que entre le rôle "Etudiant" et "Intervenant" pour éviter des soucis de sécurité.

## Liste d'Intervenants
Notre page "intervenantList", en plus de devoir avoir le rôle, demande également un OTP, obtenable la première fois lorsqu'on souhaite aller sur la page, et ensuite stocké dans la base de données. A chaque connexion sur la page, si l'utilisateur à déjà un MFA d'activé, il ne lui sera demandé que le code, et aucun nouveau QRCode sera géré.
