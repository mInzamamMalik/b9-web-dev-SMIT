import express from 'express';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();

import apiv1Router from './apiv1/index.mjs'
import apiv2Router from './apiv2/index.mjs'


const app = express();
app.use(express.json()); // body parser
// app.use(cors())



app.use("/api/v1", apiv1Router)
app.use("/api/v2", apiv2Router)



//     /static/vscode_windows.exe
app.use("/static", express.static(path.join(__dirname, 'static')))

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})
