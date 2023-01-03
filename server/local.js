const app = require('./dist/index');
const PORT = process.env.PORT || 3001;

// start the Express server
app.listen( PORT, () => {
    console.log( `server started at http://localhost:${ PORT }` );
} );