const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/reportes', (req, res) => {
    const db = router.db;
    const report = req.body;
    
    // Validar datos aquí si es necesario
    
    db.get('reportes')
        .push(report)
        .write();
    
    res.status(201).json(report);
});

server.use(router);
server.listen(3001, () => {
    console.log('JSON Server is running on port 3001');
});