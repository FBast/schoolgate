export const generateSelectOptions = (type, i18nInstance) => {
    const labels = i18nInstance.global.messages[i18nInstance.global.locale][type];
    return Object.entries(labels).map(([key, label]) => ({
        value: key,
        label,
    }));
};