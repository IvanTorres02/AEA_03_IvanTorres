import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());


const readData = () => {
    try {
        const data = fs.readFileSync("./archivosJSON/notificacion.json");
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./archivosJSON/notificacion.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};

app.get("/", (req, res) => {
    res.send("Hola");
});

app.get("/archivosJSON/notificacion", (req, res) => {
    const data = readData();
    res.json(data.notificacion);
});

app.get("/archivosJSON/notificacion/:id_usuario", (req, res) => {
    const data = readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus request
    //que conté l'atribut params i el podem consultar
    const id = parseInt(req.params.id_usuario);
    const notificacion = data.notificacion.find((notificacion) => notificacion.id_usuario === id);
    res.json(notificacion);
});

//Creem un endpoint del tipus post per afegir un llibre

app.post("/archivosJSON/notificacion", (req, res) => {
    const data = readData();
    const body = req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const nuevaNotificacion = {
        id_usuario: data.notificacion.length + 1,
        ...body,
    };
    data.notificacion.push(nuevaNotificacion);
    writeData(data);
    res.json(nuevaNotificacion);
});

app.put("/archivosJSON/notificacion/:id_usuario", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id_usuario);
    const notificacionIndex = data.notificacion.findIndex((notificacion) => notificacion.id === id);
    data.notificacion[notificacionIndex] = {
    ...data.notificacion[notificacionIndex],
    ...body,
    };
    writeData(data);
    res.json({ message: "Notification updated successfully" });
    });

    //Creem un endpoint per eliminar un llibre
app.delete("/archivosJSON/notificacion/:id_usuario", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id_usuario);
    const notificacionIndex = data.notificacion.findIndex((notificacion) => notificacion.id_usuario === id);
    //splice esborra a partir de bookIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.notificacion.splice(notificacionIndex, 1);
    writeData(data);
    res.json({ message: "Notification deleted successfully" });
    });

//Funcio per escoltar
app.listen(3002, () => {
    console.log("Server listening on port 3002")
});