export const generateSelectOptions = (type, i18nInstance) => {
    const labels = i18nInstance.global.messages[i18nInstance.global.locale][type];
    return Object.entries(labels).map(([key, label]) => ({
        value: key,
        label,
    }));
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
};