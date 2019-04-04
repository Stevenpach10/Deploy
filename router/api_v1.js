const express = require('express');
var app = express();
const router = express.Router();
const mysql = require('mysql');
var multer = require('multer');
fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

//SERVIDOR DE PRUEBAS
/*var connection = mysql.createConnection({
    host: 'localhost',
    user: 'calendario',
    password: 'calendario',
    database: 'calendario',
    port: 3306,
    multipleStatements: true
});*/
//SERVIDOR DE AWS
var connection = mysql.createConnection({
    host: 'calendario.chrl7epuhomu.us-east-1.rds.amazonaws.com',
    user: 'calendario',
    password: 'calendario',
    database: 'CALENDARIO',
    port: 3306,
    multipleStatements: true,
    timeout: 60000
});
connection.connect();


router.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
})
router.post("/upload", upload.single("image"), function (req, res, next) {
    res.json({'message': 'File uploaded'});
});

router.get("/images/:nombre", function(req, res, next) {
    nombreImagen = req.params.nombre
     fs.readFile(appDir + '/images/' + nombreImagen, function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            res.writeHead(200,{'Content-type':'image/png'});
            res.end(content);
        }
    });
})
/*
  router.get('/regions', (req, res) => {
    
    let sql = "SELECT * FROM  region";
 
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd"); 
            throw err;
        }
        var r = JSON.stringify(result); 
        res.write(r);
        res.end();
    });
})
 
router.post('/regions', (req, res) => {
    
    let sql = "CALL CREATE_REGION(" +
               "'" + req.body.NAME_REGION + "'" +
                ");";
 
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de insertar los datos en la bd"); 
            throw err;
        }
    });
 
    res.send('200');
})
 
router.put('/regions', (req, res) => {
    
    let sql = "CALL UPDATE_REGION(" +
                req.body.ID_REGION + 
                ",'" + req.body.NAME_REGION + "'" +
                ");";
 
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd"); 
            throw err;
        }
    });
 
    res.send('200');
})
 
router.delete('/regions/:ID_REGION', (req, res) => {
    
    let sql = "CALL DELETE_REGION(" +
                req.params.ID_REGION + 
                ");";
 
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de eliminar los datos en la bd"); 
            throw err;
        }
    });
 
    res.send('200');
})
*/
// router obras
// get todas las obras
router.get('/obras', (req, res) => {

    let sql = "SELECT * FROM  OBRA_DE_ARTE";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})

// router get obra con id
router.get('/obras/:id', (req, res) => {

    let sql = "SELECT * FROM  OBRA_DE_ARTE where ID_OBRA_DE_ARTE = " + req.params.id;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        res.json(result);
        res.end();
    });
})

//Configuracion usuario Administrador
//router delete CLIENTE
router.delete('/clients', (req, res) => {

    let sql = "CALL DELETE_CLIENTE(" +
        req.params.ID_CLIENTE +
        ");";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de eliminar los datos en la bd");
            throw err;
        }
    });
    res.send('200');
})

//router delet CLIENTEs por id
router.delete('/clients/:id', (req, res) => {

    let sql = "CALL DELETE_CLIENTE(" +
        req.params.id +
        ");";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd");
            throw err;
        }
    });
    res.send('200');
})

router.post('/obras', (req, res) => {

    let sql = "CALL CREATE_OBRA_DE_ARTE(" +
        "'" + req.body.NOMBRE_DE_OBRA + "'," +
        "'" + req.body.IMG_SOURCE + "'," +
        "'" + req.body.NOMBRE_ARTISTA + "'," +
        req.body.LARGO + "," +
        req.body.ANCHO + "," +
        req.body.YEAR + "," +
        "'" + req.body.FECHA_INICIO + "'," +
        "'" + req.body.FECHA_FIN + "'," +
        req.body.ID_TIPO_DE_TECNICA + "," +
        req.body.ID_TIPO_COLECCION +
        ");";
    
    console.log(sql)

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de insertar los datos en la bd");
            throw err;
        }
    });

    res.send('200');
})

router.put('/obras', (req, res) => {

    let sql = "CALL UPDATE_OBRA_DE_ARTE(" +
        req.body.ID_OBRA_DE_ARTE + "," +
        "'" + req.body.NOMBRE_DE_OBRA + "'," +
        "'" + req.body.IMG_SOURCE + "'," +
        "'" + req.body.NOMBRE_ARTISTA + "'," +
        req.body.LARGO + "," +
        req.body.ANCHO + "," +
        req.body.YEAR + "," +
        "'" + req.body.FECHA_INICIO + "'," +
        "'" + req.body.FECHA_FIN + "'," +
        req.body.ID_TIPO_DE_TECNICA + "," +
        req.body.ID_TIPO_COLECCION + ");";
    console.log(sql);
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd");
            throw err;
        }
    });

    res.send('200');
})


//router update cliente
router.put('/clients', (req, res) => {

    let sql = "CALL UPDATE_CLIENTE(" +
        req.body.ID_CLIENTE + ",'" 
        + req.body.NOMBRE + "','" 
        + req.body.PASSWORD + "','" 
        + req.body.CORREO + "'," +
        + 1  +");";
    console.log(sql)
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd");
            throw err;
        }
    });
    res.send('200');
})

router.delete('/obras/:id', (req, res) => {

    let sql = "CALL DELETE_OBRA_DE_ARTE(" +
        req.params.id +
        ");";
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd");
            throw err;
        }
    });
    res.send('200');
})
/*
********************************************************************************************************
*  Region of: Client
*  Versión 0.1
*  Autor: Steven Pacheco Portuguez
************************************************
********************************************************
*/

router.get('/clients', (req, res) => {

    let sql = "SELECT * FROM  CLIENTE;";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})
module.exports = router

// get CLIENTE por id

router.get('/client/:id',(req,res)=>{
    let sql = "SELECT * FROM  CLIENTE WHERE ID_CLIENTE=" + req.params.id;

    connection.query(sql, function(err, result){
        if(err){
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        res.json(result);
        res.end();
    });
})
router.post('/clients', (req, res) => {

    let sql = "CALL CREATE_CLIENTE(" +
        "'" + req.body.NOMBRE + "' ," +
        "'" + req.body.CORREO + "' ," +
        "'" + req.body.PASSWORD + "' ," +
        "" + req.body.ID_TIPO_CLIENTE + "" +
        ");";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de insertar los datos en la bd");
            throw err;
        }
    });

    res.send('200');
})

// router obras
// get todas las obras
router.get('/obras', (req, res) => {

    let sql = "SELECT * FROM  OBRA_DE_ARTE";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})

// router get obra con id
router.get('/obras/:id', (req, res) => {

    let sql = "SELECT * FROM  OBRA_DE_ARTE WHERE ID_OBRA_DE_ARTE = " + req.params.id;

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})

/*
********************************************************************************************************
*  Region of: Problema
*  Versión 0.1
*  Autor: Steven Pacheco Portuguez
********************************************************************************************************
*/

router.get('/problemas', (req, res) => {

    let sql = "CALL SELECT_PROBLEM_DATE();";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result[0]);
        res.write(r);
        res.end();
    });
})

router.post('/problem', (req, res) => {

    let sql = "CALL CREATE_PROBLEMA(" +
               "'" + req.body.NOMBRE + "' ," +
               "'" + req.body.LATEX_SOURCE_PROBLEMA + "' ," +
               "" + req.body.ID_TIPO_PROBLEMA + " ," +
               "'" + req.body.LATEX_SOURCE_SOLUCION + "'"+
                ");";
    console.log(sql);
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de insertar los datos en la bd");
            throw err;
        }
    });

    res.send('200');
})


router.get('/singleProblem', (req, res) => {
    
    let sql = "CALL SELECT_PROBLEM();";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd"); 
            throw err;
        }
        var r = JSON.stringify(result[0]); 
        res.write(r);
        res.end();
    });
})

router.delete('/problemas/:NOMBRE', (req, res) => {
    
    let sql = "CALL DELETE_PROBLEMA('" +
                req.params.NOMBRE + 
                "');";
    console.log(sql)
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de eliminar los datos en la bd"); 
            throw err;
        }
    });
 
    res.send('200');
})

router.put('/singleProblem', (req, res) => {
    
    let sql = "CALL UPDATE_PROBLEMA(" +
                req.body.ID_PROBLEMA + 
                ",'" + req.body.NOMBRE + "'" +
                ",'" + req.body.LATEX_SOURCE_PROBLEMA + "'" +
                "," + req.body.ID_TIPO_PROBLEMA + "" +
                ",'" + req.body.LATEX_SOURCE_SOLUCION + "'" +
                ");";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd"); 
            throw err;
        }
    });

    res.send('200');
})

router.get('/singleProblem/:NOMBRE', (req, res) => {
    
    let sql = "CALL SELECT_PROBLEM_NOMBRE('"+req.params.NOMBRE+"');";
    console.log(sql);
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd"); 
            throw err;
        }
        var r = JSON.stringify(result[0]); 
        res.write(r);
        res.end();
    });
})

router.post('/problemDate', (req, res) => {

    let sql = "CALL CREATE_PROBLEM_DATE(" +
               "'" + req.body.NOMBRE + "' ," +
               "'" + req.body.FECHA_LIBERACION_PROBLEMA + "' ," +
               "'" + req.body.FECHA_LIBERACION_SOLUCION + "'"+
                ");";
    console.log(sql);
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de insertar los datos en la bd");
            throw err;
        }
    });

    res.send('200');
})

router.put('/problemDate', (req, res) => {
    
    let sql = "CALL UPDATE_PROBLEMA_DATE(" +
                req.body.ID_PROBLEMA_FECHA_LIBERACION + 
                ",'" + req.body.FECHA_LIBERACION_PROBLEMA + "'" +
                ",'" + req.body.FECHA_LIBERACION_SOLUCION + "'" +
                ");";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de actualizar los datos en la bd"); 
            throw err;
        }
    });

    res.send('200');
})

router.get('/problemDate/:NOMBRE', (req, res) => {
    
    let sql = "CALL SELECT_PROBLEM_DATE_BY_NAME('"+req.params.NOMBRE+"');";
    console.log(sql);
    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd"); 
            throw err;
        }
        var r = JSON.stringify(result[0]); 
        res.write(r);
        res.end();
    });
})
/*
********************************************************************************************************
*  Region of: Tipo problema
*  Versión 0.1
*  Autor: Steven Pacheco Portuguez
********************************************************************************************************
*/

router.get('/tipoProblema', (req, res) => {

    let sql = "CALL SELECT_TIPO_PROBLEMA();";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result[0]);
        res.write(r);
        res.end();
    });
})

/*
********************************************************************************************************
*  Region of: Tipo coleccion
*  Versión 0.1
*  Autor: Fabri
********************************************************************************************************
*/

router.get('/tipoColeccion', (req, res) => {

    let sql = "SELECT * FROM  CALENDARIO.TIPO_COLECCION;";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})

/*
********************************************************************************************************
*  Region of: Tipo tecnica
*  Versión 0.1
*  Autor: Fabri
********************************************************************************************************
*/

router.get('/tipoTecnica', (req, res) => {

    let sql = "SELECT * FROM  CALENDARIO.TIPO_DE_TECNICA;";

    connection.query(sql, function (err, result, fields) {
        if (err) {
            console.log("ERROR al momento de obtener datos de la bd");
            throw err;
        }
        var r = JSON.stringify(result);
        res.write(r);
        res.end();
    });
})

