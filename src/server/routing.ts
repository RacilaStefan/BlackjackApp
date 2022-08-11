import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { ASSET_TYPES } from '../util/constants';


const log = console.log;

const error = (message: string, res: ServerResponse) => {
    res.writeHead(500, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message, status: 500}));
}

export function requestListener(req: IncomingMessage, res: ServerResponse) {
    const route = (req.url || '');

    let extension = route.substring(route.lastIndexOf("."));
    extension = extension === route ? '' : extension;
    const contentType = ASSET_TYPES[extension];
    log('Route', route);
    log('Extension', extension);
    log('Content type', contentType);
    if(contentType === undefined){
        error('Unsuported asset', res);
        return;
    }

    if (extension === '') {
        fs.readFile('./build/index.html', (err, file) => {
            res.writeHead(200);
            res.end(file);
        });
    } else {
        fs.readFile(`./build${route}`, (err, file) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"message": "not found", "status": 404}));
                return;
            }
            res.writeHead(200);
            res.end(file);
        });
    }
}