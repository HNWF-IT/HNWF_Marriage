const BookGenre = Object.freeze({
    COMPARATIVE_RELIGION: 'Comparative Religion',
    ISLAM: 'Islam',
    CHRISTIANITY: 'Christianity',
    JUDAISM: 'Judaism',
});

const BookStatus = Object.freeze({
    AVAILABLE: 'Available',
    CHECKED_OUT: 'Checked Out',
    RESERVED: 'Reserved',
    LOST: 'Lost',
});

const BookLanguage = Object.freeze({
    URDU: 'Urdu',
    ARABIC: 'Arabic',
    ENGLISH: 'English',
    OTHER: 'Other',
});

export { BookGenre, BookStatus, BookLanguage };