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
      <html lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>Fiche de Renseignements</title>
        <style>
          @page { size: A4; margin: 1cm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; padding: 20px; color: #000; }
          
          /* En-tête avec logos */
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .logo-box { width: 100px; height: 80px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        .header-center { text-align: center; font-weight: bold; font-size: 14px; }
        
        .date-section { text-align: left; margin-bottom: 20px; font-weight: bold; }
        
        .title { text-align: center; text-decoration: underline; font-size: 18px; margin-bottom: 30px; color: #1e40af; }
        
        /* Structure des champs */
        .row { display: flex; align-items: flex-end; margin-bottom: 18px; width: 100%; }
        .label { font-weight: bold; white-space: nowrap; margin-left: 10px; min-width: 150px; }
        .dots { border-bottom: 1px dotted #444; flex-grow: 1; min-height: 20px; padding-right: 10px; font-style: italic; }
        
        /* Options (Cases à cocher / Choix) */
        .options-row { display: flex; gap: 30px; margin: 20px 0; }
        .option { display: flex; align-items: center; gap: 10px; }
        .checkbox { width: 15px; height: 15px; border: 1px solid #000; display: inline-block; }
        
        .driver-license-grid { display: flex; gap: 15px; margin-top: 10px; font-weight: bold; }
        
        @media print {
            .candidate { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      ${candidates.map(c => `
        <div class="candidate">
          <div class="header">
            <div class="logo-box">LOGO GAUCHE</div>
            <div class="header-center">
                المملكة المغربية<br>
                المبادرة الوطنية للتنمية البشرية<br>
                عمالة مقاطعات سيدي البرنوصي
            </div>
            <div class="logo-box">LOGO DROIT</div>
          </div>

          <div class="date-section">تاريخ: ..................... / 2025</div>

          <div class="title">معلومات شخصية</div>

          <div class="row">
            <span class="label">الإسم الشخصي :</span>
            <div class="dots">${c.prenom}</div>
          </div>

          <div class="row">
            <span class="label">الإسم العائلي :</span>
            <div class="dots">${c.nom}</div>
          </div>

          <div class="row">
            <span class="label">رقم البطاقة الوطنية :</span>
            <div class="dots">${c.cin}</div>
          </div>

          <div class="row">
            <span class="label">تاريخ الإزدياد :</span>
            <div class="dots">${new Date(c.dateNaissance).toLocaleDateString('fr-FR')}</div>
          </div>

          <div class="row">
            <span class="label">مكان الإزدياد :</span>
            <div class="dots">${c.lieuNaissance || ''}</div>
          </div>

          <div class="options-row">
            <span class="label">الجنس :</span>
<div class="option">ذكر <div class="checkbox">${c.genre === 'Homme' ? '✓' : ''}</div></div>
<div class="option">أنثى <div class="checkbox">${c.genre === 'Femme' ? '✓' : ''}</div></div>
          </div>

          <div class="options-row">
            <span class="label">الحالة العائلية :</span>
            <div class="option">عازب(ة) <div class="checkbox"></div></div>
            <div class="option">متزوج(ة) <div class="checkbox"></div></div>
            <div class="option">مطلق(ة) <div class="checkbox"></div></div>
            <div class="option">أرمل(ة) <div class="checkbox"></div></div>
          </div>

          <div class="row">
            <span class="label">العنوان :</span>
            <div class="dots">${c.adresse || ''}</div>
          </div>

          <div class="row">
            <span class="label">رقم الهاتف :</span>
            <div class="dots">${c.telephone}</div>
          </div>

          <div class="row">
            <span class="label">رقم الهاتف (Whatsapp) :</span>
            <div class="dots">${c.telephone}</div>
          </div>

          <div class="row">
            <span class="label">البريد الإلكتروني :</span>
            <div class="dots">${c.email}</div>
          </div>

          <div class="row">
            <span class="label">هل تتوفر على رخصة السياقة :</span>
            <div class="option">نعم <div class="checkbox"></div></div>
            <div class="option">لا <div class="checkbox"></div></div>
          </div>

          <div class="driver-license-grid">
            <span>أي فئة ؟ :</span>
            <span>A</span> <span>A1</span> <span>B</span> <span>C</span> <span>D</span> <span>EB</span> <span>EC</span> <span>ED</span>
          </div>

          <div style="margin-top: 30px;">
            <div class="row">
              <span class="label">مهنة الأب :</span>
              <div class="dots"></div>
            </div>
            <div class="row">
              <span class="label">مهنة الأم :</span>
              <div class="dots"></div>
            </div>
          </div>
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
