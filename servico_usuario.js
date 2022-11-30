
let usuarioGenerico = {}

exports.criarUsuario = async (data) => {
    console.log(`simulando criação no banco de dados`)

    const idRandomico =  Math.floor(Math.random() * (1000 - 1) + 1)

    usuarioGenerico = {
        ...data,
        id: idRandomico,
        confirmacaoConta: false
    }

    return usuarioGenerico
}

exports.validarUsuario = async ({ email, senha }) => {
    console.log('simulando retorno banco de dados')
    const usuarioConfirmou = usuarioGenerico.confirmacaoConta === true
    if (!usuarioConfirmou) {
        throw new Error("Usuario não confirmou a conta!")
    }

    if (usuarioGenerico.email !== email || usuarioGenerico.senha !== senha ) {
        throw new Error("Email ou senha inválidos!")
    }
    return {
        ...usuarioGenerico,
        senha: undefined
    }
}

exports.confirmaCadastro = async (id) => {
    console.log(`simulando atualização no banco de dados`)
    usuarioGenerico.confirmacaoConta = true
    return {
        ...usuarioGenerico,
        senha: undefined
    }
}
