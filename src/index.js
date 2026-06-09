import { app } from "./App.js";
import dotenv from "dotenv";
import Connectdb from "./db/index.js";
import http from "http";
import { initSocketServer } from "./sockets/index.js";


dotenv.config({ path: "./.env" });



const server=http.createServer(app)
initSocketServer(server)
Connectdb().then(()=>{
    server.listen(process.env.Port,()=>{
          console.log(`app is running on port : ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err)
})