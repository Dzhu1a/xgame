import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import connectDB from './models/instal.js';
import getPaginatedData from './pagination/paginaion.js';
import cartModel from './models/cartMod.js';
import User from './models/userModel.js';
import Basket from './models/basketModel.js';
import Order from './models/orderModel.js'; // Імпортуємо модель замовлення

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_CONNECTION = process.env.DB_CONNECTION;

app.use(express.json());

const frontDir = path.join(__dirname, '../Front');

app.use(express.static(frontDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontDir, 'club.html'));
});


const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

app.get('/api/carts', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Налаштування multer для завантаження файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Вказуємо uploads як директорію призначення
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/api/carts/add', upload.single('img'), async (req, res) => {
    const { manufacturer, season, gender, price } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null;

    if (!manufacturer || !season || !gender || !price || !img) {
        return res.status(400).json({ message: 'Заповніть всі поля' });
    }

    const newCart = new cartModel({
        manufacturer,
        season,
        gender,
        price,
        img
    });

    try {
        await newCart.save();
        res.status(201).json({ message: 'Картку додано успішно', newCart });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error });
    }
});

app.post('/api/check-user', async (req, res) => {
    const { login } = req.body;
    console.log(`Перевірка користувача: ${login}`);
    if (!login) {
        return res.status(400).json({ success: false, message: 'Логін не вказано' });
    }

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Користувача не знайдено' });
        }
        res.json({ success: true, isAdmin: user.isAdmin });
    } catch (error) {
        console.error('Помилка перевірки користувача:', error);
        res.status(500).json({ success: false, message: 'Помилка сервера' });
    }
});

// User registration
app.post('/register', async (req, res) => {
    const { login, password, confirmPassword, name, email, phone, city, address, newPostOffice } = req.body;

    if (!login || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Заповніть всі поля' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Паролі не співпадають' });
    }

    try {
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ error: 'Користувач з таким логіном вже існує' });
        }
        const userWithSamePassword = await User.findOne({ password });
        if (userWithSamePassword) {
            return res.status(400).json({ error: 'Користувач з таким паролем вже існує' });
        }
        const user = new User({
            login,
            password,
            isAdmin: false,
            name,
            email,
            phone,
            city,
            address,
            newPostOffice,
        });

        await user.save();
        res.status(201).json({ message: 'Користувача створено успішно' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { login, password, isAdmin, name, email, phone, city, address, newPostOffice } = req.body;

        const user = new User({
            login,
            password,
            isAdmin,
            name,
            email,
            phone,
            city,
            address,
            newPostOffice,
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password -isAdmin');
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Маршрут для отримання даних користувача за логіном
app.get('/api/users', async (req, res) => {
    const { login } = req.query;
    try {
        const user = await User.findOne({ login }).select('-password -isAdmin');
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.get('/api/orders/all', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Помилка отримання всіх замовлень:', error);
        res.status(500).json({ message: 'Не вдалося отримати всі замовлення' });
    }
});
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    
    try {
        const user = await User.findOne({ login });

        if (!user) {
            return res.status(400).json({ error: 'Користувача з таким логіном немає' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Неправильний пароль' });
        }

        res.json({ isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.get('/pagination', async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;

    try {
        const result = await getPaginatedData(cartModel, page);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

app.post('/api/basket/:cartId', async (req, res) => {
    console.log('Received request to /api/basket/:cartId');
    const { cartId } = req.params;
    const { login } = req.body;

    try {
        const newBasketItem = new Basket({
            cartId,
            login
        });

        await newBasketItem.save();
        res.status(201).json({ message: 'Товар додано в кошик' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не вдалося додати товар в кошик' });
    }
});

app.get('/api/basket/:login', async (req, res) => {
    const login = req.params.login;
    console.log(`Отримання даних baskets для входу: ${login}`);
    try {
        const baskets = await Basket.find({ login });
        console.log('Baskets знайдено:', baskets);

        const cartIds = baskets.map(b => b.cartId.toString());

        const cartModels = await cartModel.find({ _id: { $in: cartIds } });
        console.log('CartModels знайдено:', cartModels);
        res.json(cartModels);
    } catch (error) {
        console.error('Помилка отримання basket даних:', error);
        res.status(500).send('Внутрішня помилка сервера');
    }
});

app.delete('/api/baskets', async (req, res) => {
    const { cartId, login } = req.query;
    console.log(`Received DELETE request with cartId=${cartId} and login=${login}`);
    
    try {
        const baskets = await Basket.find({ cartId, login });
        console.log('Baskets знайдено для видалення:', baskets);

        if (baskets.length === 0) {
            console.log('Документи для видалення не знайдені');
            return res.status(404).json({ error: 'Документи для видалення не знайдені' });
        }

        const deletedItems = await Basket.deleteMany({ cartId, login });

        console.log(`Успішно видалено ${deletedItems.deletedCount} документів`);
        res.json({ message: `Успішно видалено ${deletedItems.deletedCount} документів` });
    } catch (error) {
        console.error('Помилка видалення документів:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
app.delete('/api/baskets/:login', async (req, res) => {
    const login = req.params.login;
    console.log(`Received DELETE request with login=${login}`);
    
    try {
        const deletedItems = await Basket.deleteMany({ login });

        if (deletedItems.deletedCount === 0) {
            console.log('Документи для видалення не знайдені');
            return res.status(404).json({ error: 'Документи для видалення не знайдені' });
        }

        console.log(`Успішно видалено ${deletedItems.deletedCount} документів`);
        res.json({ message: `Успішно видалено ${deletedItems.deletedCount} документів` });
    } catch (error) {
        console.error('Помилка видалення документів:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});
app.put('/api/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Замовлення не знайдено' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Статус оновлено', order });
    } catch (error) {
        console.error('Помилка оновлення статусу замовлення:', error);
        res.status(500).json({ message: 'Не вдалося оновити статус' });
    }
});




app.get('/api/cart/:id', async (req, res) => {
    try {
        const cart = await cartModel.find({ _id: {$in:req.params.id }});
        if (!cart || cart.length === 0) {
            return res.status(404).json({ message: 'Картку не знайдено' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Помилка отримання картки:', error);
        res.status(500).send({ message: 'Помилка сервера', error: error.message });
    }
});
app.put('/api/cart/update/:id', upload.single('img'), async (req, res) => {
    const { id } = req.params;
    const { manufacturer, season, gender, price } = req.body;
    const img = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const updatedCart = await cartModel.findByIdAndUpdate(id, {
            manufacturer,
            season,
            gender,
            price,
            img
        }, { new: true });

        if (!updatedCart) {
            return res.status(404).json({ message: 'Картку не знайдено' });
        }

        res.json({ message: 'Картку оновлено успішно', updatedCart });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error });
    }
});
// Маршрут для отримання замовлень користувача
app.get('/api/orders', async (req, res) => {
    const { login } = req.query;
    try {
        const orders = await Order.find({ login });
        if (!orders) {
            return res.status(404).json({ message: 'Замовлення не знайдено' });
        }
        res.json(orders);
    } catch (error) {
        console.error('Помилка отримання замовлень:', error);
        res.status(500).json({ message: 'Не вдалося отримати замовлення' });
    }
});

app.post('/register', async (req, res) => {
    const { login, password, confirmPassword, name, email, phone, city, address, newPostOffice } = req.body;

    if (!login || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Заповніть всі поля' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Паролі не співпадають' });
    }

    try {
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ error: 'Користувач з таким логіном вже існує' });
        }
        const userWithSamePassword = await User.findOne({ password });
        if (userWithSamePassword) {
            return res.status(400).json({ error: 'Користувач з таким паролем вже існує' });
        }
        const user = new User({
            login,
            password,
            isAdmin: false,
            name,
            email,
            phone,
            city,
            address,
            newPostOffice,
        });

        await user.save();
        res.status(201).json({ message: 'Користувача створено успішно' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Маршрут для створення замовлення
app.post('/api/orders', async (req, res) => {
    try {
        const { login, status, date, items, totalSum } = req.body;
        const newOrder = new Order({ login, status, date, items, totalSum });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Помилка створення замовлення:', error);
        res.status(500).json({ message: 'Не вдалося створити замовлення' });
    }
});

// Маршрут для отримання всіх замовлень
app.get('/api/orders', async (req, res) => {
    const { login } = req.query;

    if (!login) {
        console.error('Необхідний логін користувача');
        return res.status(400).json({ message: 'Необхідний логін користувача' });
    }

    try {
        const user = await User.findOne({ login });

        if (!user) {
            console.error('Користувача не знайдено');
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const orders = await Order.find({ userId: user._id });
        console.log('Замовлення користувача:', orders);

        res.json(orders);
    } catch (error) {
        console.error('Помилка отримання замовлень:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});
app.post('/orders', async (req, res) => {
    const { customerName, customerEmail, customerPhone, deliveryAddress, items, totalPrice } = req.body;

    const order = new Order({
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        items,
        totalPrice
    });

    try {
        await order.save();
        res.status(201).json({ message: 'Замовлення успішно створено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка створення замовлення' });
    }
});

// Fetch all orders
app.get('/api/orders/all', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання замовлень' });
    }
});
app.get('/api/users/login/:login', async (req, res) => {
    const login = req.params.login;

    try {
        const user = await User.findOne({ login: login });
        if (!user) {
            return res.status(404).json({ error: 'Користувача з таким логіном не знайдено' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання даних про користувача' });
    }
});
// Fetch order by id
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання замовлення' });
    }
});

app.put('/api/users', async (req, res) => {
    const { login, name, email, phone, city, address, newPostOffice } = req.body;

    try {
        let user = await User.findOne({ login });

        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        // Оновлюємо або додаємо тільки ті поля, які передані в запиті
        user.name = name !== undefined ? name : user.name;
        user.email = email !== undefined ? email : user.email;
        user.phone = phone !== undefined ? phone : user.phone;
        user.city = city !== undefined ? city : user.city;
        user.address = address !== undefined ? address : user.address;
        user.newPostOffice = newPostOffice !== undefined ? newPostOffice : user.newPostOffice;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Помилка оновлення даних користувача', error });
    }
});
app.delete('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        // Видалити замовлення з бази даних
        await Order.findByIdAndRemove(orderId);

        res.json({ message: 'Замовлення та фото успішно видалено' });
    } catch (error) {
        console.error('Помилка видалення замовлення:', error);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    }
});

app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        res.json({ message: 'Замовлення успішно видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення замовлення' });
    }
});
app.delete('/api/carts/:id', async (req, res) => {
    try {
        const cartId = req.params.id;
        
        // Знайти картку за ID
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Картку не знайдено' });
        }

        // Перевірити наявність шляху до фото
        if (!cart.img) {
            return res.status(404).json({ message: 'Фото не знайдено' });
        }

        // Отримати абсолютний шлях до фото
        const photoPath = path.join(__dirname, cart.img);

        // Перевірити існування файлу
        if (!fs.existsSync(photoPath)) {
            console.error('Файл не знайдено:', photoPath);
            return res.status(404).json({ message: 'Фото не знайдено' });
        }

        // Видалити фото з папки uploads
        fs.unlink(photoPath, async (err) => {
            if (err) {
                console.error('Помилка видалення фото:', err);
                return res.status(500).json({ message: 'Помилка видалення фото', error: err.message });
            }

            // Видалити картку з бази даних після успішного видалення фото
            const deletedCart = await cartModel.findByIdAndDelete(cartId);

            if (!deletedCart) {
                return res.status(404).json({ message: 'Картку не знайдено' });
            }

            res.json({ message: 'Картку та фото видалено успішно' });
        });
    } catch (error) {
        console.error('Помилка видалення картки:', error);
        res.status(500).send({ message: 'Помилка сервера', error: error.message });
    }
});
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер працює на http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Не вдалося підключитися до бази даних:', error);
});
