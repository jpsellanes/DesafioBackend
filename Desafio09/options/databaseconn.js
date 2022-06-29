const optionsSQL = {
    client : 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '39670598',
        database: 'ecommerce'
    }
}

const optionsDB = {
    client : 'sqlite3',
    connection: {
        filename: './db/databaseDB.sqlite'
    },
    useNullAsDefault: true
}

module.exports = {optionsSQL, optionsDB}
