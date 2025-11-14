const { Pool } = require("pg");

let pool = null;

async function connect() {
    if (pool !== null) {
        return pool;
    }

    try {
        pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            database: process.env.DB_NAME
        });

        // Teste a conexão
        const client = await pool.connect();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        client.release();
        
        return pool;
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error.message);
        throw error;
    }
}

async function getEmail() {
    try {
        const pool = await connect();
        const result = await pool.query("SELECT * FROM tb_usuarios");
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar emails:', error.message);
        throw error;
    }
}

async function postEmail(email) {
    try {
        const pool = await connect();
        const query = "INSERT INTO tb_usuarios (email) VALUES ($1) RETURNING *";
        const result = await pool.query(query, [email]);

    } catch (error) {
        console.error('Erro ao inserir email:', error.message);
        throw error;
    }
}

async function delEmail(id) {
    try {
        const pool = await connect();
        const query = "DELETE FROM tb_usuarios WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);
        
    } catch (error) {
        console.error('Erro ao inserir id:', error.message);
        throw error;
    }
}

module.exports = {
    getEmail,
    postEmail,
    delEmail
}