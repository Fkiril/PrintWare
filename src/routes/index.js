const spsoRouter = require('./spso')
function route(app){
    app.use('/spso', spsoRouter)
}

module.exports = route
