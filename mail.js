// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const path = require('path');

// Création de l'application Express
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration de l'email
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Utilise ton service d'email (ex: Gmail, ou SMTP)
    auth: {
        user: 'ton-email@gmail.com', // Remplace par ton email
        pass: 'ton-mot-de-passe'     // Remplace par ton mot de passe (ou un mot de passe d'application Gmail)
    }
});

// Fonction pour générer le PDF du bail
function generateContractPDF(data) {
    const doc = new PDFDocument();
    const filename = `bail_${data.firstName}_${data.lastName}.pdf`;

    doc.pipe(fs.createWriteStream(path.join(__dirname, filename)));
    
    // Contenu du bail
    doc.fontSize(20).text('Bail de location de box', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Nom: ${data.firstName} ${data.lastName}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Adresse de facturation: ${data.streetNumber} ${data.streetName}, ${data.postalCode} ${data.city}`);
    doc.text(`Box choisi: ${data.boxSize} m² - ${data.price}€`);
    doc.text(`Assurance choisie: ${data.insurance}`);
    
    doc.end();
    
    return filename;
}

// Route pour envoyer l'email
app.post('/send-email', (req, res) => {
    const userData = req.body;

    // Génération du bail au format PDF
    const contractPDF = generateContractPDF(userData);

    // Configuration de l'email
    const mailOptions = {
        from: 'ton-email@gmail.com',
        to: userData.email,  // L'email de l'utilisateur
        subject: 'Confirmation de votre réservation de box',
        text: `Bonjour ${userData.firstName},\n\nVotre réservation pour un box de stockage a bien été enregistrée. Vous trouverez ci-joint votre bail et votre facture.\n\nCordialement,\nL'équipe de location de box`,
        attachments: [
            {
                filename: contractPDF,
                path: path.join(__dirname, contractPDF)
            }
            // Tu peux ajouter ici la facture en PDF si nécessaire
        ]
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email envoyé');
    });
});

// Lancer le serveur Express
app.listen(port, () => {
    console.log(`Le serveur tourne sur http://localhost:${port}`);
});
