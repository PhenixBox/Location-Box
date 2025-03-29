document.getElementById("locationForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupérer les informations du formulaire
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const tailleBox = document.getElementById("taille").value;
  const ibans = document.getElementById("iban").value;
  const assurance = document.getElementById("assurance").value;
  const accepterConditions = document.getElementById("acceptConditions").checked;

  // Vérifier que l'utilisateur accepte les conditions
  if (!accepterConditions) {
    alert("Vous devez accepter les conditions pour générer le bail.");
    return;
  }

  // Calcul du montant total
  const prixBox = tailleBox === "15" ? 90 : 130;
  const prixAssurance = assurance.includes("10") ? 10 : 20;
  const montantTotal = prixBox + prixAssurance;

  // Créer le contenu du bail
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`Contrat de Location de Box de Stockage`, 20, 20);
  doc.text(`Nom: ${nom}`, 20, 30);
  doc.text(`Prénom: ${prenom}`, 20, 40);
  doc.text(`Taille du Box: ${tailleBox} m²`, 20, 50);
  doc.text(`IBAN: ${ibans}`, 20, 60);
  doc.text(`Assurance choisie: ${assurance}`, 20, 70);
  doc.text(`Montant total à payer: ${montantTotal}€`, 20, 80);

  // Ajouter la signature
  doc.text(`Le Locataire: ______________________`, 20, 100);
  doc.text(`Le Bailleur: ______________________`, 20, 110);

  // Sauvegarder le PDF
  doc.save(`${prenom}_${nom}_contrat_location_box.pdf`);
});
