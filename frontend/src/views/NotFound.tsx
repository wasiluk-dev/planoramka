import React, { useEffect } from 'react';

import '../index.css';

type NotFoundProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const NotFound: React.FC<NotFoundProps> = ({ setDocumentTitle }) => {
    useEffect(() => {
        setDocumentTitle('404');
    }, []);

    return (
        <div className="not-found">
            <h1>404</h1>
            <p>Nie ma czego plądrować</p>
        </div>
    );
};

export default NotFound;
