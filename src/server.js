const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const db = require("./db");
const express = require("express");

const app = express();

// Middleware para processar JSON
app.use(express.json());

const port = process.env.PORT || 3000;

// Rota de verificação de saúde do servidor
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "Servidor está funcionando!" });
});

app.get("/email", async (req, res) => {
    try {
        const emails = await db.getEmail();
        res.json(emails);
    } catch (error) {
        console.error('Erro na rota /email:', error);
        res.status(500).json({ 
            error: "Erro interno do servidor",
            message: error.message
        });
    }
});

app.post("/email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: "Dados inválidos",
                message: "O campo email é obrigatório"
            });
        }

        const result = await db.postEmail(email);
        res.status(201).json(result);
    } catch (error) {
        console.error('Erro na rota POST /email:', error);
        res.status(500).json({ 
            error: "Erro interno do servidor",
            message: error.message
        });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

