import dbConnect from '../../../utils/dbConnect';
import Store from '../../../models/Shop';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const stores = await Store.find({});

                res.status(200).json({ success: true, data: stores })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const store = await Store.create(req.body);

                res.status(201).json({ success: true, data: store })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}