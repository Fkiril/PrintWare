const spsoRouter = require('./spso')
function route(app){
    // app.get('/', (req, res) => {
    //     res.send('Hello World!')
    //   })
    app.use('/spso', spsoRouter)
}

module.exports = route
