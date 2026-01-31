const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Need bcrypt to hash admin password
const Outlet = require('./models/Outlet');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User'); // Import User model

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
    // ... (rest of outlets same)
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
        name: 'Dominos Pizza',
        description: 'Dil, Dosti, Dominos. Pizzas and sides.',
        location: 'Food Court',
        openingTime: '11:00 AM',
        closingTime: '02:00 AM',
        averagePrepTime: 15,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        categories: ['Pizza', 'Sides', 'Beverages']
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

const dominosMenu = [
    { name: 'Margherita', price: 199, category: 'Pizza', description: 'Classic cheese pizza', prepTime: 15 },
    { name: 'Farmhouse', price: 259, category: 'Pizza', description: 'Onion, capsicum, tomato, mushroom', prepTime: 15 },
    { name: 'Peppy Paneer', price: 289, category: 'Pizza', description: 'Paneer cubes with paprika', prepTime: 15 },
    { name: 'Garlic Breadsticks', price: 99, category: 'Sides', description: 'Baked with garlic butter', prepTime: 10 },
    { name: 'Choco Lava Cake', price: 99, category: 'Sides', description: 'Molten chocolate cake', prepTime: 10 },
];

const southernStoriesMenu = [
    { name: 'Vanilla Scoop', price: 60, category: 'Ice Cream', description: 'Two scoops of vanilla', prepTime: 2 },
    { name: 'Chocolate Fudge', price: 120, category: 'Ice Cream', description: 'Ice cream with hot fudge sauce', prepTime: 5 },
    { name: 'Mango Shake', price: 100, category: 'Shakes', description: 'Seasonal mango shake', prepTime: 5 },
    { name: 'Masala Corn', price: 50, category: 'Snacks', description: 'Steamed sweet corn with spices', prepTime: 5 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Clear existing data
        await Outlet.deleteMany();
        await MenuItem.deleteMany();
        await User.deleteMany();
        console.log('Cleared existing data (Outlets, Menus, Users)');

        // Create Outlets
        const createdOutlets = await Outlet.insertMany(outlets);
        console.log(`Created ${createdOutlets.length} outlets`);

        // Helper to find outlet by name
        const findOutlet = (name) => createdOutlets.find(o => o.name === name);

        // Add Menu Items
        const canteen = findOutlet('M Block Canteen');
        const snapEats = findOutlet('SnapEats');
        const subway = findOutlet('Subway');
        const dominos = findOutlet('Dominos Pizza');
        const southernStories = findOutlet('Southern Stories');

        if (canteen) {
            await MenuItem.insertMany(mainCanteenMenu.map(item => ({ ...item, outletId: canteen._id })));
            console.log('Added M Block Canteen menu');

            // Create Admin for M Block Canteen
            await User.create({
                name: "Canteen Admin",
                email: "admin@canteen.com",
                password: "admin123",
                phone: "9999999999",
                role: "admin",
                outletId: canteen._id
            });
            console.log('Created Admin User');
        }

        if (snapEats) {
            await MenuItem.insertMany(snapEatsMenu.map(item => ({ ...item, outletId: snapEats._id })));
            console.log('Added SnapEats menu');
        }

        if (subway) {
            await MenuItem.insertMany(subwayMenu.map(item => ({ ...item, outletId: subway._id })));
            console.log('Added Subway menu');
        }

        if (dominos) {
            await MenuItem.insertMany(dominosMenu.map(item => ({ ...item, outletId: dominos._id })));
            console.log('Added Dominos menu');
        }

        if (southernStories) {
            await MenuItem.insertMany(southernStoriesMenu.map(item => ({ ...item, outletId: southernStories._id })));
            console.log('Added Southern Stories menu');
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

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();
