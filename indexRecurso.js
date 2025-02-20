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
        const data = fs.readFileSync("./archivosJSON/recurso.json");
        //paso la informacion del archivo a un objeto
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};


const writeData = (data) => {
    try {
        fs.writeFileSync("./archivosJSON/recurso.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};
//req = pedir datos ; res = responder
app.get ("/", (req, res) => {
    res.send("Welcome to my first API with Node.js");
});

app.get("/archivosJSON/recurso", (req, res) => {
    const data = readData();
    res.json(data.recurso);
})

app.get("/archivosJSON/recurso/:resurso_id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.resurso_id);
    console.log(id);
    const recurso=data.recurso.find((recurso)=>recurso.resurso_id===id);
   
    console.log(recurso);
    res.json(recurso);
});

//Creem un endpoint del tipus post per afegir un llibre

app.post("/archivosJSON/recurso",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newRecurso={
        resurso_id:data.recurso.length+1,
        ...body,
    };
    data.recurso.push(newRecurso);
    writeData(data);
    res.json(newRecurso);
});

app.put("/archivosJSON/recurso/:resurso_id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.resurso_id);
    const recursoI = data.recurso.findIndex((recurso) => recurso.resurso_id === id);
    data.recurso[recursoI] = {
    ...data.recurso[recursoI],
    ...body,
    };
    writeData(data);
    res.json({ message: "Recurso añadido" });
    });

                   
    //Creem un endpoint per eliminar un llibre
app.delete("/archivosJSON/recurso/:resurso_id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.resurso_id);
    const Index = data.recurso.findIndex((recurso) => recurso.resurso_id === id);
    //splice esborra a partir de bookIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.recurso.splice(Index, 1);
    writeData(data);
    res.json({ message: "Recurso deleted successfully" });
    });








//Funcion para escuchar
app.listen(3002, () => {
    console.log("Server is running on port 3003");
});