// import du fichier de la fonction ajoutListenersAvis du fichier avis.js
import {
  ajoutListenersAvis,
  ajoutListenerEnvoyerAvis,
  afficherAvis,
  afficherGraphiqueAvis,
} from "./avis.js";

// Fonction pour charger les pièces
async function chargerPieces() {
  // Récupération des pièces eventuellement stockées dans le localStorage
  let pieces = window.localStorage.getItem("pieces");

  if (pieces === null) {
    // Chargement des pièces depuis le fichier JSON
    const reponse = await fetch("pieces-autos.json");
    pieces = await reponse.json();
    // Stockage des informations dans le localStorage
    const valeurPieces = JSON.stringify(pieces);
    window.localStorage.setItem("pieces", valeurPieces);
  } else {
    pieces = JSON.parse(pieces);
  }

  return pieces;
}

// Fonction principale
async function main() {
  const pieces = await chargerPieces();

  // On appelle la fonction pour ajouter l'écoute du listener au formulaire
  ajoutListenerEnvoyerAvis();

  // Générer les pièces
  genererPieces(pieces);

  for (let i = 0; i < pieces.length; i++) {
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if (avis !== null) {
      const pieceElement = document.querySelector(`article[data-id="${id}"]`);
      afficherAvis(pieceElement, avis);
    }
  }

  //gestion des boutons
  const boutonTrier = document.querySelector(".btn-trier");
  boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
      return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
  });

  const boutonFiltrer = document.querySelector(".btn-filtrer");
  boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
      return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
  });

  //Correction Exercice
  const filtrerPiecesAvcDescription = document.querySelector(
    ".btn-filtrer-description"
  );
  filtrerPiecesAvcDescription.addEventListener("click", function () {
    const piecesFiltreesDescription = pieces.filter(function (piece) {
      return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltreesDescription);
  });

  const btnTrierDecroissant = document.querySelector(".btn-trier-decroissant");
  btnTrierDecroissant.addEventListener("click", function () {
    const piecesOrdonneesDecr = Array.from(pieces);
    piecesOrdonneesDecr.sort(function (a, b) {
      return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonneesDecr);
  });

  //Filtrer les pièces dont le prix est inférieur ou égal à 35€
  const noms = pieces.map((piece) => piece.nom);
  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
      noms.splice(i, 1);
    }
  }
  console.log(noms);

  //Création de l'en-tête
  const pElement = document.createElement("p");
  pElement.innerText = "Pièces abordables:";
  //Création de la liste
  const abordablesElements = document.createElement("ul");
  //Ajout de chaque nom à la liste
  for (let i = 0; i < noms.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
  }
  // Ajout de l'en-tête puis de la liste au bloc résultats filtres en 1 seule ligne
  document
    .querySelector(".abordables")
    .appendChild(pElement)
    .appendChild(abordablesElements);

  //Code Exercice
  //Filtrer les pièces qui sont disponibles, c-a-d disponibilité = true
  const nomsDisponibles = pieces.map((piece) => piece.nom); //liste des nom des pièces
  const prixDisponibles = pieces.map((piece) => piece.prix); //liste des prix des pièces

  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponibilite === false) {
      nomsDisponibles.splice(i, 1);
      prixDisponibles.splice(i, 1);
    }
  }

  //Création de la liste
  const disponiblesElements = document.createElement("ul");
  //Ajout de chaque nom + prix des pièces dispos à la liste
  for (let i = 0; i < nomsDisponibles.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElements.appendChild(nomElement);
  }

  // Ajout de l'en-tête puis de la liste au bloc résultats filtres
  const pElementDisponible = document.createElement("p");
  pElementDisponible.innerText = "Pièces disponibles:";
  document
    .querySelector(".dispo")
    .appendChild(pElementDisponible)
    .appendChild(disponiblesElements);

  //Code Exercice P2C3
  const inputPrixMax = document.querySelector("#prix-max");
  inputPrixMax.addEventListener("input", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
      return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
  });

  // Ajout du listener pour mettre à jour des données du localStorage
  const boutonMettreAJour = document.querySelector(".btn-maj");
  boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
  });
}

// Appel de la fonction principale
main().catch(console.error);

// Définition de la fonction genererPieces
function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches");
    // Création d'une balise dédiée à une pièce automobile
    const pieceElement = document.createElement("article");
    // Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} € (${
      article.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "Pas de description pour le moment.";
    const stockElement = document.createElement("p");
    stockElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock";
    //Code ajouté pour les avis avant utilisation fetch ex P3C1
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    // On rattache la balise article a la section Fiches
    sectionFiches.appendChild(pieceElement);
    // On rattache l'image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    //Ajout des éléments au DOM pour l'exercice
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(stockElement);
    //Ajout de l'élement avisBouton au DOM
    pieceElement.appendChild(avisBouton);
  }
  // Appel de la fonction ajoutListenersAvis
  ajoutListenersAvis();
}
