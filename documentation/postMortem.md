# PostMortem du projet

## Gestion des rôles
La gestion des rôles à été une certaine réflexion. Devoir aller à la base de données pour modifier directement le rôle en brut, ce n'était pas bon. Il fallait donc que je crée un panneau d'administration capable de pouvoir modifier directement les rôles. 
**REUSSI**

## Le panneau d'administration
Le panneau d'administration m'a posé un sérieux problème car, pour envoyer donc le nouveau rôle, nous avions besoin du nouveau role (sélectionné par la liste de sélection), mais aussi du nom d'utilisateur. En cherchant un peu, j'ai trouvé qu'on pouvait ajouter un tag <input> avec en type "hidden" ce qui lui permet d'être totalement invisible. Grâce à ça, j'ai pu donc stocker mon username dans le <p> qui servait d'affichage et dans le <input> invisible qui me permettait de récupérer le username lorsque j'appuie sur le bouton "Modifier"
**REUSSI**

## L'OTP sur le panneau d'administration
J'ai eu comme idée de rajouter l'OTP également sur le panneau d'administration étant donné qu'il est important de sécuriser la modification possible des rôles dans la base de données. Cependant, je n'ai pas réussi à trouver de moyens correctes pour le rajouter, ayant préféré en rester la plutôt que d'allourdir mon code avec quelque chose de peu stable.
**ECHEC**

## Rajout d'un système de premier utilisateur "admin"
J'ai voulu rajouter un système permettant que le tout premier utilisateur crée soit directement un admin, cependant je n'ai pas réussi à y arriver, et j'ai préféré laisser cette idée de côté.
**ECHEC**