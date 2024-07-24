import  './Header.css'

const Header = () => {
    return(
        <div className="header">
                Strona głowna
            <div className="headerSites">
                <div className="block">
                    Podstrona 1
                </div>
                <div className="block">
                    Podstrona 2
                </div>
                <div className="block">
                    Podstrona 3
                </div>
                <div className="block">
                    Podstrona 4
                </div>
            </div>
        </div>
    );
}

export default Header;