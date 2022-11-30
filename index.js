require("dotenv").config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const os = require('os');

const disparaEmail = require('./dispara_email')
const servicoUsuario = require('./servico_usuario')
const { porta, servidor, segredo } = require('./env')

app.use(express.json())

app.post('/cadastro', async (request, response) => {
    try {
        const { email, nome, senha } = request.body

        if (!email || !nome ||!senha ) {
            throw new Error("Informe os campos!")
        }

        // simulando a criação no banco de dados
        const usuario = await servicoUsuario.criarUsuario({
            email,
            nome,
            senha
        })

        const { id } = usuario
        // criando o token de expiração para confirmação de conta
        const token = jwt.sign(
            {
                id,
                nome,
                email
            },
            segredo,
            {
                expiresIn: '2m'
            }
        )

        const urlCompleta = `${servidor}/cadastro/confirmar?token=${token}`

        await disparaEmail.disparar({
            para: email,
            assunto: 'Confirmação de conta',
            texto: `
                <h2>olá ${nome}<h2><br>
                <p>Confirme seu email através deste <a href="${urlCompleta}">link</a>
            `,
            ehHtml: true
        })
    
        response.json({
            mensagem: 'Email enviado!'
        })
    } catch (error) {
        response.json({
            erro: error.message
        })
    }
})

app.get('/cadastro/confirmar', async (request, response) => {
    try {
        const token = request.query.token
        const dadosDecodificados = jwt.verify(token, segredo)
        await servicoUsuario.confirmaCadastro(dadosDecodificados.id)
        const primeiroNome =  dadosDecodificados.nome.split(' ')[0]
        response.send(`<h1>${primeiroNome}, sua conta foi confirmada com sucesso!<h1>`)
    } catch (error) {
        response.send("<h1>Token não autorizado!<h1>")
    }
})

app.post('/login', async (request, response) => {
    try {
        const { email, senha } = request.body

        if (!email||!senha ) {
            throw new Error("Informe os campos!")
        }
        // simulando a criação no banco de dados
        const usuario = await servicoUsuario.validarUsuario({
            email,
            senha
        })

        response.json({
            usuario
        })
    } catch (error) {
        response.json({
            error: error.message
        })
    }
})

app.listen(porta,() => {
    console.log(`Running on port: ${porta}`)
})