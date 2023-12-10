const { default: app } = require("./app.mjs")

app.listen(3000, () => {
    console.log('servidor rodando em http://localhost:3000')
})