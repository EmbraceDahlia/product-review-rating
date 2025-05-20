import express, { Request, Response, NextFunction } from 'express';
import productRouter from './routes/productRoute';

const app = express();
app.set("port", process.env.PORT || 3003);
const port = app.get("port");

app.use(express.json());

app.use('/products', productRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true })
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ success: false, error: err.message });
});

app.listen(port, () => console.log(`Server running at port ${port}...`));