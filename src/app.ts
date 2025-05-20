import express, { Request, Response, NextFunction } from 'express';
import productRouter from './routes/productRoute';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3003);
const port = app.get("port");

app.use(express.json());

app.use('/products', productRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'API Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ success: false, error: err.message });
});

app.listen(port, () => console.log(`Server running at port ${port}...`));