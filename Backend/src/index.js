import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'signup'
});

db.connect((err) => {
    if (err) {
        console.error('การเชื่อมต่อฐานข้อมูลไม่สำเร็จ:', err);
    } else {
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');
    }
});

// เส้นทาง GET สำหรับการทดสอบ
app.get('/register', (req, res) => {
    res.send('This is the register route');
});

app.post('/register', (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ Error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sql = "INSERT INTO register (`name`,`email`,`password`,`phone`) VALUES (?)";

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error during hashing:", err);
            return res.status(500).json({ Error: "ข้อมูลที่ไม่ถูกต้อง" });
        }

        const values = [name, email, hash, phone];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Error during database query:", err);
                return res.status(500).json({ Error: "การเชื่อมต่อฐานข้อมูลไม่สำเร็จ" });
            }
            return res.status(200).json({ Status: "Success" });
        });
    });
});

app.listen(8081, () => {
    console.log("Running on port 8081");
});
