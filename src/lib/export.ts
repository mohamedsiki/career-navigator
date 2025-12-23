import { Candidate } from '@/types/candidate';

export const exportToJSON = (candidates: Candidate[], filename: string = 'candidats') => {
  const dataStr = JSON.stringify(candidates, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
};

export const exportToCSV = (candidates: Candidate[], filename: string = 'candidats') => {
  if (candidates.length === 0) return;
  
  const headers = [
    'ID', 'Nom', 'Prénom', 'CIN', 'Date de naissance', 'Lieu de naissance',
    'Genre', 'Adresse', 'Arrondissement', 'Téléphone', 'Email',
    'Type de candidat', 'Situation matrimoniale', 'Occupation mère', 'Occupation père',
    'Niveau d\'étude', 'Type de diplôme', 'Filière', 'Expérience générale',
    'Langues', 'Milieu', 'Source d\'inscription', 'Objectif',
    'Formation choisie', 'Orientation', 'Destination', 'Date d\'orientation',
    'Observations', 'Date de création', 'Date de modification'
  ];
  
  const rows = candidates.map(c => [
    c.id, c.nom, c.prenom, c.cin, c.dateNaissance, c.lieuNaissance,
    c.genre, c.adresse, c.arrondissement, c.telephone, c.email,
    c.typeCandidat, c.situationMatrimoniale, c.occupationMere, c.occupationPere,
    c.niveauEtude, c.typeDiplome, c.filiereDiplome, c.experienceGenerale,
    c.langues.map(l => `${l.name} (${l.level})`).join('; '),
    c.milieu, c.sourceInscription, c.objectif,
    c.formationChoisie, c.orientation, c.destination, c.dateOrientation,
    c.observations, c.dateCreation, c.dateModification
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

export const exportToExcel = (candidates: Candidate[], filename: string = 'candidats') => {
  // Generate a simple HTML table that Excel can open
  if (candidates.length === 0) return;
  
  const headers = [
    'ID', 'Nom', 'Prénom', 'CIN', 'Date de naissance', 'Lieu de naissance',
    'Genre', 'Adresse', 'Arrondissement', 'Téléphone', 'Email',
    'Type de candidat', 'Situation matrimoniale', 'Occupation mère', 'Occupation père',
    'Niveau d\'étude', 'Type de diplôme', 'Filière', 'Expérience générale',
    'Langues', 'Milieu', 'Source d\'inscription', 'Objectif',
    'Formation choisie', 'Orientation', 'Destination', 'Date d\'orientation',
    'Observations', 'Date de création', 'Date de modification'
  ];
  
  const tableHTML = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body>
    <table border="1">
      <thead>
        <tr>${headers.map(h => `<th style="background:#2563EB;color:white;font-weight:bold;">${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${candidates.map(c => `
          <tr>
            <td>${c.id}</td>
            <td>${c.nom}</td>
            <td>${c.prenom}</td>
            <td>${c.cin}</td>
            <td>${c.dateNaissance}</td>
            <td>${c.lieuNaissance}</td>
            <td>${c.genre}</td>
            <td>${c.adresse}</td>
            <td>${c.arrondissement}</td>
            <td>${c.telephone}</td>
            <td>${c.email}</td>
            <td>${c.typeCandidat}</td>
            <td>${c.situationMatrimoniale}</td>
            <td>${c.occupationMere}</td>
            <td>${c.occupationPere}</td>
            <td>${c.niveauEtude}</td>
            <td>${c.typeDiplome}</td>
            <td>${c.filiereDiplome}</td>
            <td>${c.experienceGenerale}</td>
            <td>${c.langues.map(l => `${l.name} (${l.level})`).join('; ')}</td>
            <td>${c.milieu}</td>
            <td>${c.sourceInscription}</td>
            <td>${c.objectif}</td>
            <td>${c.formationChoisie}</td>
            <td>${c.orientation}</td>
            <td>${c.destination}</td>
            <td>${c.dateOrientation}</td>
            <td>${c.observations}</td>
            <td>${c.dateCreation}</td>
            <td>${c.dateModification}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, `${filename}.xls`);
};

export const exportToPDF = (candidates: Candidate[], filename: string = 'candidats') => {
  // Create a printable HTML document
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Liste des Candidats</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 10px; }
        h1 { text-align: center; color: #2563EB; margin-bottom: 20px; font-size: 18px; }
        .candidate { page-break-inside: avoid; border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 8px; }
        .candidate-header { background: #2563EB; color: white; padding: 10px; margin: -15px -15px 15px -15px; border-radius: 8px 8px 0 0; }
        .section { margin-bottom: 10px; }
        .section-title { font-weight: bold; color: #2563EB; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .field { }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .observations { background: #f9f9f9; padding: 8px; border-radius: 4px; margin-top: 5px; }
        @media print { .candidate { page-break-inside: avoid; } }
      </style>
    </head>
    <body>
      <h1>Liste des Candidats - Plateforme de Gestion</h1>
      <p style="text-align:center;margin-bottom:20px;color:#666;">Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
      ${candidates.map(c => `
        <div class="candidate">
          <div class="candidate-header">
            <strong>${c.nom} ${c.prenom}</strong> - ${c.id}
          </div>
          
          <div class="section">
            <div class="section-title">Identité</div>
            <div class="grid">
              <div class="field"><span class="label">CIN:</span> <span class="value">${c.cin}</span></div>
              <div class="field"><span class="label">Né(e) le:</span> <span class="value">${new Date(c.dateNaissance).toLocaleDateString('fr-FR')}</span></div>
              <div class="field"><span class="label">Lieu:</span> <span class="value">${c.lieuNaissance}</span></div>
              <div class="field"><span class="label">Genre:</span> <span class="value">${c.genre}</span></div>
              <div class="field"><span class="label">Téléphone:</span> <span class="value">${c.telephone}</span></div>
              <div class="field"><span class="label">Email:</span> <span class="value">${c.email}</span></div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Formation & Expérience</div>
            <div class="grid">
              <div class="field"><span class="label">Niveau:</span> <span class="value">${c.niveauEtude}</span></div>
              <div class="field"><span class="label">Diplôme:</span> <span class="value">${c.typeDiplome}</span></div>
              <div class="field"><span class="label">Filière:</span> <span class="value">${c.filiereDiplome}</span></div>
              <div class="field"><span class="label">Expérience:</span> <span class="value">${c.experienceGenerale}</span></div>
              <div class="field"><span class="label">Langues:</span> <span class="value">${c.langues.map(l => l.name).join(', ')}</span></div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Orientation</div>
            <div class="grid">
              <div class="field"><span class="label">Type:</span> <span class="value">${c.typeCandidat}</span></div>
              <div class="field"><span class="label">Objectif:</span> <span class="value">${c.objectif}</span></div>
              <div class="field"><span class="label">Formation:</span> <span class="value">${c.formationChoisie}</span></div>
              <div class="field"><span class="label">Orientation:</span> <span class="value">${c.orientation}</span></div>
              <div class="field"><span class="label">Destination:</span> <span class="value">${c.destination}</span></div>
            </div>
          </div>
          
          ${c.observations ? `<div class="observations"><span class="label">Observations:</span> ${c.observations}</div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
