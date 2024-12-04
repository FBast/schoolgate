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

export const downloadFile = (fileBuffer, fileName, extension) => {
    if (!extension) {
        console.error("File extension must be specified.");
        return;
    }

    const mimeTypes = {
        pdf: 'application/pdf',
        zip: 'application/zip'
    };

    const mimeType = mimeTypes[extension.toLowerCase()];
    if (!mimeType) {
        console.error(`Unsupported file extension: .${extension}`);
        return;
    }

    const date = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
    const finalFileName = `${fileName}_${date}.${extension}`;

    const fileBlob = new Blob([new Uint8Array(fileBuffer.data)], { type: mimeType });

    const url = URL.createObjectURL(fileBlob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', finalFileName);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
