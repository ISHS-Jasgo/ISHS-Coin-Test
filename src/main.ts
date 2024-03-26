import express, { Request, Response, NextFunction } from 'express';

import { crespRest } from './rest/rest_producer'
import { logger } from './logging/central_log';

import { cf } from './config/config';
import { BlockChain } from './blockchain';
import { Block } from './block';

const app = express();
app.use(express.json());

app.use('*', (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`Request to '${req.url}' over ${req.method}`);
    next();
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.header('Content-Type', 'application/json');
    res.status(200).send(BlockChain.instance.blockchain2json());
});

app.post('/', (req: Request, res: Response, next: NextFunction) => {
    let data = req.body.data;
    Block.mineBlock(data);
    res.header('Content-Type', 'application/json');
    res.status(200).send(BlockChain.instance.blockchain2json());
});

app.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('404 Not Found');
});
app.post('*', (req: Request, res: Response, next: NextFunction) => {
    res.header('Content-Type', 'application/json');
    res.status(404).send(crespRest(404));
});

app.listen(cf.server.port, () => {
    logger.info(`Server started on port ${cf.server.port}`)

    console.log(BlockChain.instance.chain)
});
