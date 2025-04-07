const SectType = Object.freeze({
    AHL_E_HADESS: "Ahl E Hadees",
    DEOBAND: "Deoband",
    BARELVI: "Barelvi",
    SHIA: "Shia",
    OTHER: "Other"
});

const Education = Object.freeze({
    BELOW_MATRIC: "Below Matric",
    MATRIC: "Matric",
    INTER: "Inter",
    BACHELORS: "Bachelors",
    MASTERS: "Masters",
    PHD: "Phd",
    AALIM: "Aalim",
    OTHER: "Other"
});

const MaritalStatus = Object.freeze({
    SINGLE: "Single",
    MARRIED: "Married",
    DIVORCED: "Divorced",
    WIDOW: "Widow",
    OTHER: "Other"
});

const Nationality = Object.freeze({
    PAKISTANI: "Pakistani",
    OVERSEAS_PAKISTANI: "Oversea Pakistani",
    FORIEGNER: "Foriegner"
});

const HouseOwnership = Object.freeze({
    OWN: "Own",
    RENT: "Rent",
    OTHER: "Other"
});

const MuslimStatus = Object.freeze({
    BORN: "Born",
    REVERTED: "Reverted",  
});

const Gender = Object.freeze({
    MALE: "Male",
    FEMALE: "Female",  
});

export { SectType, MaritalStatus, Education, Nationality, HouseOwnership, MuslimStatus, Gender };