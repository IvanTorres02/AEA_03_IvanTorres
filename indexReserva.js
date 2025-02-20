import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
//Crea el servidor
const app = express();
//
app.use(bodyParser.json());


const readDataReserva = () => {
    try {
        //caja de herramientas para leer archivos
        const data = fs.readFileSync("./archivosJSON/reserva.json");
        //paso la informacion del archivo a un objeto
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
    }
};


const writeDataReserva = (data) => {
    try {
        fs.writeFileSync("./archivosJSON/reserva.json", JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
};
//req = pedir datos ; res = responder
app.get ("/", (req, res) => {
    res.send("Welcome to my first API with Node.js");
});

app.get("/archivosJSON/reserva", (req, res) => {
    const data = readDataReserva();
    res.json(data.reserva);
})

app.get("/archivosJSON/reserva/:reserva_id",(req,res)=>{
    const data=readDataReserva();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.reserva_id);
    console.log(id);
    const reserva=data.reserva.find((reserva)=>reserva.reserva_id===id);
   
    console.log(reserva);
    res.json(reserva);
});

//Creem un endpoint del tipus post per afegir un llibre

app.post("/archivosJSON/reserva",(req,res)=>{
    const data=readDataReserva();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newreserva={
        reserva_id:data.reserva.length+1,
        ...body,
    };
    data.reserva.push(newreserva);
    writeDataReserva(data);
    res.json(newreserva);
});

app.put("/archivosJSON/reserva/:reserva_id", (req, res) => {
    const data = readDataReserva();
    const body = req.body;
    const id = parseInt(req.params.reserva_id);
    console.log(id);
    const reservaI = data.reserva.findIndex((reserva) => reserva.reserva_id === id);
    data.reserva[reservaI] = {
    ...data.reserva[reservaI],
    ...body,
    };
    writeDataReserva(data);
    res.json({ message: "reserva añadida" });
}); 

                   
    //Creem un endpoint per eliminar un llibre
app.delete("/archivosJSON/reserva/:reserva_id", (req, res) => {
    const data = readDataReserva();
    const id = parseInt(req.params.reserva_id);
    const Index = data.reserva.findIndex((reserva) => reserva.reserva_id === id);
    //splice esborra a partir de bookIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.reserva.splice(Index, 1);
    writeDataReserva(data);
    res.json({ message: "reserva deleted successfully" });
});




//Funcion para escuchar
app.listen(3003, () => {
    console.log("Server is running on port 3003");
});