export const formatDateWithTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).format(new Date(date));
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
};

export const toISOString = (datetimeLocal) => {
    return new Date(datetimeLocal).toISOString();
}

export const toDatetimeLocal = (isoString) => {
    if (!isoString) return ''; // Gérer les valeurs null ou undefined
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const downloadFile = (pdfBuffer, pdfName) => {
    // Ajouter la date au nom du fichier
    const date = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
    const fileName = `${pdfName}_${date}.pdf`;

    // Créer le Blob à partir du buffer
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer.data)], { type: 'application/pdf' });

    // Créer une URL temporaire pour le Blob
    const url = URL.createObjectURL(pdfBlob);

    // Créer le lien temporaire
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);

    // Ajouter le lien au DOM pour permettre le clic
    document.body.appendChild(link);

    // Déclencher le téléchargement
    link.click();

    // Nettoyer le lien temporaire
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
