import moment from "moment";

export const getLanguage = () => {
    const rawLanguage =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;
    return moment.locale(rawLanguage || "en");
};
