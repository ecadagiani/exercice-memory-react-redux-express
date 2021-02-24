# Pyrite-oclock-memory
Un site web, jeu de memory pour apprendre les égalités en JS

## Installation
### Pre-requis
Avoir **npm**, **docker** et **docker-compose** d'installé.

### Mise en place - Test
1. Copier coller le `.env.dist` en `.env`, modifier les valeurs au besoin (notamment les ports)
2. `npm run build`
3. `npm start`
4. Rendez-vous sur http://localhost:3000 (ou un autre port si vous avez changé FRONT_PORT)

### Mise en place - Dev
1. Copier coller le `.env.dist` en `.env`, modifier les valeurs au besoin (notamment les ports).
2. `npm run install:local` pour installer tout les packages.
3. `npm run start:local` pour démarrer les packages en development.



## Serveur
La partie *Back* est réparti en 3 sections: **Http**,  **Game**, **Database**.

### HTTP
La partie Http comprend la classe `HttpController` et le routeur `GamesRouter`

`HttpController` gère le serveur express, le paramètre et ajoute le(s) routeurs.

`GamesRouter` crée un routeur express avec toutes les routes en rapport avec les parties.

#### JOI
Grace à `Joi` et `express-joi-validation`, inutile de vérifier si 
les paramètres (query, body, params) existent, s'il est required (et non présent),
ou du mauvais type. Alors `express-joi-validation` répondra de lui-même avec une erreur.

### Database
La classe `MysqlConnection` permet de gérer la connexion à la bdd et l'ensemble des query à envoyer.

### Game
Contient 3 classes utilisées pour gérer l'ensemble du jeu.

#### User
Gère les utilisateurs, ceux-ci ont un id et un name. Comme le nom n'est pas obligatoire,
celui-ci peut être généré aléatoirement. Peut les récupérer de la base, et les stocker.

#### Board
Cette classe gère le plateau de jeu, avec les cartes. Elle stocke la taille
du plateau et les cartes. Elle peut également créer un plateau aléatoire.

#### Game
La classe Game permet de gérer les parties, 
changer leurs statuts, en créer des nouvelles, les récupérer et les modifier sur la base.



## Front - react
### Composants
La partie *vue/graphique* est divisée en 3 groupes:
- Les components: des composants react très simple, et très réutilisable
- Les containers: Ce sont des composants plus en rapport avec l'application, de ce fait ils sont moins réutilisable
- Les layouts: Ce sont des containers connectés à redux. Ils sont le dernier maillon des vues. 
  Ce sont des composants de plus haut niveau.
  
### Store
Le store est géré à l'aide des fonctions de `reduxjs/toolkit`. Qui permet une 
gestion plus simple et plus propre de redux. 

Les requêtes vers le serveur sont géré via des actions asynchrones.

### Style
Le style est géré en scss, il est divisé en deux parties:

Le style global stocké dans `src/assets/style`, ces fichiers s'occupent
du style des layouts et des containers.

Pour les components le fichier de style est stocké à coté du fichier jsx 
(`src/components`).

Pour le component `CardList`, afin de réaliser une grid dynamique, 
`@emotion/styled` est utilisé.
