export default function isLoggedIn() {
    // ADD CHECK TO SEE IF ITS A VALID JWT TOKEN!
    // HAVING THE REAL SECRET KEY!

    // TODO: Imporve this function!
    if (localStorage.getItem("token")) {
        return true;
    }
    return false;
}