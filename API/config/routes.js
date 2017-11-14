const GameController = require('../controllers/gameController');

module.exports = (app) => {

    // Watch for incoming requests of method GET
    // to the route http://localhost:3050/sudoku
    app.get('/sudoku/:level', GameController.index);
    app.post('/sudoku/checksolution/:id', GameController.checker);
    app.get('/sudoku/getsolution/:id', GameController.solution);
    app.post('/sudoku/hint/:id', GameController.hint);
    app.post('/sudoku/save', GameController.save);
    app.get('/sudoku/load/:id', GameController.load);
    app.post('/sudoku/listgames', GameController.savedGames);
};