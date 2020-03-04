import { createServer, Server } from 'http';
import * as express from 'express';
import { createConnection } from 'typeorm';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as errorHandler from './middlewares/apiErrorHandler';
import routes from './routes';
import { DBConnection } from './config/db-config';

export class AppServer {
    public static readonly PORT: number = 5000;
    private app: express.Application;
    private server: Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        // Call midlewares
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(bodyParser.json());

        //Set all routes from routes folder
        this.app.use('/', routes);

        // Error Handler
        // this.app.use(errorHandler.notFoundErrorHandler);
        // this.app.use(errorHandler.errorHandler);

        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || AppServer.PORT;
    }

    private listen(): void {
        //Connects to the Database -> then starts the express
        let connection = DBConnection.connection1;
        // console.log('connection', connection);
        createConnection(connection)
            .then(async connection => {
                // logger.info('database connection created');

                this.server.listen(this.port, () => {
                    console.log(`Server started on port ${this.port}!`);
                    // logger.info(`Server running at ${this.port}`);
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
