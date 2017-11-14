const GameController = require('../app/controllers/gameController');

module.exports = (router) => {

    // Watch for incoming requests of method GET
    // to the route http://localhost:3050/sudoku
    router.get('/', GameController.index);
    router.post('/checksolution/:id', GameController.checker);
    router.post('/hint/:id', GameController.hint);
    router.put('/restart/:id', GameController.restart);
    router.put('/save/:id', GameController.save);
    router.get('/load/:id', GameController.load);
    router.get('/listgames', GameController.savedGames);
};