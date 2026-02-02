const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Outlet = require('./models/Outlet');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config();

const outlets = [
    {
        name: 'M Block Canteen',
        description: 'The heart of campus food. Meals, snacks, and beverages.',
        location: 'Block A, Ground Floor',
        openingTime: '08:00 AM',
        closingTime: '10:00 PM',
        averagePrepTime: 20,
        image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
        categories: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages']
    },
    {
        name: 'SnapEats',
        description: 'Brewing happiness. Coffee, shakes, and light bites.',
        location: 'Library Building',
        openingTime: '09:00 AM',
        closingTime: '11:00 PM',
        averagePrepTime: 10,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
        categories: ['Coffee', 'Shakes', 'Sandwiches', 'Desserts']
    },
    {
        name: 'Subway',
        description: 'Eat Fresh. Custom subs and salads.',
        location: 'Food Court',
        openingTime: '10:00 AM',
        closingTime: '11:00 PM',
        averagePrepTime: 5,
        image: 'https://images.unsplash.com/photo-1509722747741-090ed30b75b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80',
        categories: ['Subs', 'Salads', 'Sides']
    },
    {
        name: 'Bistro 24/7',
        description: 'Late night cravings? We got you. Burgers, fries, and coffee.',
        location: 'Student Center',
        openingTime: '00:00 AM',
        closingTime: '23:59 PM',
        averagePrepTime: 12,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Reusing coffee/cafe image style
        categories: ['Burgers', 'All Day Breakfast', 'Coffee', 'Shakes']
    },
    {
        name: 'House of Chow',
        description: 'Authentic Asian flavors. Noodles, dimsums, and more.',
        location: 'Food Court',
        openingTime: '11:00 AM',
        closingTime: '10:00 PM',
        averagePrepTime: 15,
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        categories: ['Noodles', 'Rice', 'Dimsums', 'Appetizers']
    },
    {
        name: 'Southern Stories',
        description: 'The Taste of India. Ice creams and dairy snacks.',
        location: 'Block B',
        openingTime: '10:00 AM',
        closingTime: '10:00 PM',
        averagePrepTime: 2,
        image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        categories: ['Ice Cream', 'Shakes', 'Snacks']
    }
];

const mainCanteenMenu = [
    { name: 'Aloo Paratha', price: 40, category: 'Breakfast', description: 'With curd and pickle', prepTime: 10 },
    { name: 'Veg Thali', price: 80, category: 'Lunch', description: 'Dal, Sabzi, Rice, Roti, Salad', prepTime: 5 },
    { name: 'Masala Dosa', price: 60, category: 'Snacks', description: 'With sambar and chutney', prepTime: 15 },
    { name: 'Chole Bhature', price: 70, category: 'Lunch', description: '2 Bhature with spicy chole', prepTime: 10 },
    { name: 'Tea', price: 10, category: 'Beverages', description: 'Masala chai', prepTime: 5 },
];

const snapEatsMenu = [
    { name: 'Cold Coffee', price: 100, category: 'Coffee', description: 'Chilled coffee with ice cream', prepTime: 5 },
    { name: 'Oreo Shake', price: 120, category: 'Shakes', description: 'Thick shake with oreo crumbs', prepTime: 5 },
    { name: 'Chicken Sandwich', price: 90, category: 'Sandwiches', description: 'Grilled chicken with mayo', prepTime: 10 },
    { name: 'Brownie', price: 80, category: 'Desserts', description: 'Warm walnut brownie', prepTime: 2 },
];

const subwayMenu = [
    { name: 'Veggie Delight', price: 150, category: 'Subs', description: 'Fresh veggies with choice of sauce', prepTime: 5 },
    { name: 'Paneer Tikka Sub', price: 180, category: 'Subs', description: 'Spicy paneer chunks in 6-inch sub', prepTime: 5 },
    { name: 'Chicken Teriyaki', price: 200, category: 'Subs', description: 'Sweet and savory chicken strips', prepTime: 5 },
    { name: 'Cookie', price: 40, category: 'Sides', description: 'Choco chip cookie', prepTime: 0 },
];

const houseOfChowMenu = [
    { name: 'Hakka Noodles', price: 150, category: 'Noodles', description: 'Classic stir-fried noodles', prepTime: 10 },
    { name: 'Chilli Chicken', price: 220, category: 'Appetizers', description: 'Spicy wok-tossed chicken', prepTime: 15 },
    { name: 'Veg Fried Rice', price: 160, category: 'Rice', description: 'Aromatic basmati rice with veggies', prepTime: 12 },
    { name: 'Chicken Dimsums', price: 180, category: 'Dimsums', description: 'Steamed dumplings (6 pcs)', prepTime: 15 },
    { name: 'Spring Rolls', price: 120, category: 'Appetizers', description: 'Crispy rolls with sweet chili sauce', prepTime: 10 },
];

const bistro247Menu = [
    { name: 'Classic Cheese Burger', price: 180, category: 'Burgers', description: 'Juicy patty with cheddar', prepTime: 12 },
    { name: 'Loaded Fries', price: 140, category: 'Burgers', description: 'Fries topped with cheese and jalapeños', prepTime: 8 },
    { name: 'English Breakfast', price: 250, category: 'All Day Breakfast', description: 'Eggs, toast, sausages, beans', prepTime: 15 },
    { name: 'Cappuccino', price: 110, category: 'Coffee', description: 'Freshly brewed', prepTime: 5 },
    { name: 'Pancakes', price: 160, category: 'All Day Breakfast', description: 'Fluffy pancakes with maple syrup', prepTime: 10 },
];

const southernStoriesMenu = [
    { name: 'Vanilla Scoop', price: 60, category: 'Ice Cream', description: 'Two scoops of vanilla', prepTime: 2 },
    { name: 'Chocolate Fudge', price: 120, category: 'Ice Cream', description: 'Ice cream with hot fudge sauce', prepTime: 5 },
    { name: 'Mango Shake', price: 100, category: 'Shakes', description: 'Seasonal mango shake', prepTime: 5 },
    { name: 'Masala Corn', price: 50, category: 'Snacks', description: 'Steamed sweet corn with spices', prepTime: 5 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-buddy');
        console.log('MongoDB Connected...');

        // Clear existing data
        await Outlet.deleteMany();
        await MenuItem.deleteMany();
        await User.deleteMany();

        try {
            const OrderModel = require('./models/Order');
            await OrderModel.deleteMany();
            console.log('Cleared existing data (Outlets, Menus, Users, Orders)');
        } catch (e) {
            console.log('Cleared existing data (Outlets, Menus, Users) - Orders skipped');
        }

        // Create Outlets
        const createdOutlets = await Outlet.insertMany(outlets);
        console.log(`Created ${createdOutlets.length} outlets`);

        const findOutlet = (name) => createdOutlets.find(o => o.name === name);

        // Helper to Create Admin
        const createAdmin = async (outlet, name, email) => {
            await User.create({
                name: name,
                email: email,
                password: "admin123", // Met min length 6
                phone: "9999999999",
                role: "admin",
                outletId: outlet._id
            });
            console.log(`Created Admin: ${email} for ${outlet.name}`);
        };

        // Add Menu Items & Admins
        const canteen = findOutlet('M Block Canteen');
        if (canteen) {
            await MenuItem.insertMany(mainCanteenMenu.map(item => ({ ...item, outletId: canteen._id })));
            await createAdmin(canteen, "Canteen Admin", "admin@canteen.com");
        }

        const snapEats = findOutlet('SnapEats');
        if (snapEats) {
            await MenuItem.insertMany(snapEatsMenu.map(item => ({ ...item, outletId: snapEats._id })));
            await createAdmin(snapEats, "SnapEats Admin", "admin@snapeats.com");
        }

        const subway = findOutlet('Subway');
        if (subway) {
            await MenuItem.insertMany(subwayMenu.map(item => ({ ...item, outletId: subway._id })));
            await createAdmin(subway, "Subway Admin", "admin@subway.com");
        }

        const houseOfChow = findOutlet('House of Chow');
        if (houseOfChow) {
            await MenuItem.insertMany(houseOfChowMenu.map(item => ({ ...item, outletId: houseOfChow._id })));
            await createAdmin(houseOfChow, "House of Chow Admin", "admin@chow.com");
        }

        const bistro = findOutlet('Bistro 24/7');
        if (bistro) {
            await MenuItem.insertMany(bistro247Menu.map(item => ({ ...item, outletId: bistro._id })));
            await createAdmin(bistro, "Bistro Admin", "admin@bistro.com");
        }

        const southernStories = findOutlet('Southern Stories');
        if (southernStories) {
            await MenuItem.insertMany(southernStoriesMenu.map(item => ({ ...item, outletId: southernStories._id })));
            await createAdmin(southernStories, "Southern Stories Admin", "admin@southern.com");
        }

        // Create a default student user
        await User.create({
            name: "Student User",
            email: "student@test.com",
            password: "student",
            phone: "8888888888",
            role: "student"
        });
        console.log('Created Student User: student@test.com / student');

        // Create a Super Admin (No outlet ID)
        await User.create({
            name: "Super Admin",
            email: "super@admin.com",
            password: "admin123",
            phone: "1111111111",
            role: "admin",
            // No outletId
        });
        console.log('Created Super Admin: super@admin.com / admin');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();
