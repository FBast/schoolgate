export const formatDate = (date) => {
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
