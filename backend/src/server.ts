import db from 'mongoose';
import app from "./app";

db.connect('mongodb://127.0.0.1:27017/planoramka_dev')
    .then(() =>
        app.listen(3000, () => {
            return console.log(`Serwer został uruchomiony pod adresem: http://localhost:3000`);
        })
    )
    .catch(err => {
        throw err;
    });
