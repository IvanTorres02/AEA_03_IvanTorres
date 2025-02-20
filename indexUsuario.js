import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
//Crea el servidor
const app = express();
//
app.use(bodyParser.json());

const readData = () => {
    try {
        //caja de herramientas para leer archivos
        const data = fs.readFileSync("./archivosJSON/usuario.json");
        //paso la informacion del archivo a un objeto
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};


const writeData = (data) => {
    try {
        fs.writeFileSync("./archivosJSON/usuario.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};
//req = pedir datos ; res = responder
app.get ("/", (req, res) => {
    res.send("Welcome to my first API with Node.js");
});

app.get("/archivosJSON/usuario", (req, res) => {
    const data = readData();
    res.json(data.usuario);
})

app.get("/archivosJSON/usuario/:id_usuario",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id_usuario);
    console.log(id);
    const usuario=data.usuario.find((usuario)=>usuario.id_usuario===id);
    res.json(usuario);
});

//Creem un endpoint del tipus post per afegir un llibre

app.post("/archivosJSON/usuario",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newusuario={
        id_usuario:data.usuario.length+1,
        ...body,
    };
    data.usuario.push(newusuario);
    writeData(data);
    res.json(newusuario);
});

app.put("/archivosJSON/usuario/:id_usuario", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id_usuario);
    const usuarioI = data.usuario.findIndex((usuario) => usuario.id_usuario === id);
    data.usuario[usuarioI] = {
    ...data.usuario[usuarioI],
    ...body,
    };
    writeData(data);
    res.json({ message: "usuario añadido" });
    });

                   
    //Creem un endpoint per eliminar un llibre
app.delete("/archivosJSON/usuario/:id_usuario", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id_usuario);
    const Index = data.usuario.findIndex((usuario) => usuario.id_usuario === id);
    //splice esborra a partir de bookIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.usuario.splice(Index, 1);
    writeData(data);
    res.json({ message: "usuario deleted successfully" });
    });








//Funcion para escuchar
app.listen(3002, () => {
    console.log("Server is running on port 3003");
});