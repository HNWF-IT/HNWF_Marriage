export default function isLoggedIn() {
    // ADD CHECK TO SEE IF ITS A VALID JWT TOKEN!
    // HAVING THE REAL SECRET KEY!

    // TODO: Imporve this function!
    if (document.cookie != '') {
        return true;
    }
    return false;
}