import React from 'react';
import styles from './DataManagement.module.css';

const DataManagement = ({ portfolio, cash, stocksHistory, onImport }) => {
  const handleExport = () => {
    const data = {
      portfolio,
      cash,
      stocksHistory,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validacija podataka
        if (!data.portfolio || !Array.isArray(data.portfolio)) {
          throw new Error('Nevažeći format portfelja');
        }
        if (!data.cash || !Array.isArray(data.cash)) {
          throw new Error('Nevažeći format gotovine');
        }
        if (!data.stocksHistory || typeof data.stocksHistory !== 'object') {
          throw new Error('Nevažeći format povijesti');
        }

        onImport(data);
        alert('Podaci su uspješno uvezeni!');
      } catch (error) {
        alert(`Greška pri uvozu: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.container}>
      <h3>Upravljanje Podacima</h3>
      <div className={styles.buttons}>
        <button 
          className={styles.exportButton} 
          onClick={handleExport}
          title="Spremi trenutno stanje portfelja u JSON datoteku"
        >
          📤 Izvezi Podatke
        </button>
        
        <label className={styles.importButton}>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          📥 Uvezi Podatke
        </label>
      </div>
      <p className={styles.info}>
        * Izvezite podatke redovito kako biste imali sigurnosnu kopiju
      </p>
    </div>
  );
};

export default DataManagement;
