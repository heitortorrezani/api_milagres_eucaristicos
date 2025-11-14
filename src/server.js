const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const db = require("./db");

const cors = require("cors");

const express = require("express");

const app = express();

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'landing_page_milagres_eucaristicosgi/build/web')));

const port = process.env.PORT || 3000;

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

app.delete("/email", async (req, res) => {
    try {
        const { ID } = req.body;

        if(!ID) {
            return res.status(400).json ({
                error: "dados inválidos",
                message: "o campo ID é obrigatorio!"
            })
        }

        const result = await db.delEmail(ID);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({
            error: "erro",
            message: e.message
        })
    }
});

app.post("/email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: "Dados inválidos",
                message: "O campo email é obrigatório!"
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

