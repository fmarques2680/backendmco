const { default: app } = require("./app")

app.listen(3000, () => {
    console.log('servidor rodando em http://localhost:3000')
})