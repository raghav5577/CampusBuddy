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

const ccdMenu = [
    { name: 'Cappuccino', price: 120, category: 'Coffee', description: 'Rich espresso with steamed milk foam', prepTime: 5 },
    { name: 'Choco Frappe', price: 160, category: 'Shakes', description: 'Cold chocolate coffee', prepTime: 5 },
    { name: 'Paneer Tikka Sandwich', price: 140, category: 'Sandwiches', description: 'Grilled paneer sandwich', prepTime: 10 },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Clear existing data
        await Outlet.deleteMany();
        await MenuItem.deleteMany();
        await User.deleteMany(); // Clear users too to avoid duplicates or role conflicts for demo
        console.log('Cleared existing data (Outlets, Menus, Users)');

        // Create Outlets
        const createdOutlets = await Outlet.insertMany(outlets);
        console.log(`Created ${createdOutlets.length} outlets`);

        // Add Menu Items (Example for Main Canteen and CCD)
        const canteen = createdOutlets.find(o => o.name === 'Main Canteen');
        const ccd = createdOutlets.find(o => o.name === 'Café Coffee Day');

        if (canteen) {
            const canteenItems = mainCanteenMenu.map(item => ({ ...item, outletId: canteen._id }));
            await MenuItem.insertMany(canteenItems);
            console.log('Added Main Canteen menu');

            // --- CREATE ADMIN USER ---
            // Create a default admin for Main Canteen
            // Manually hashing password because insertMany or direct create via mongoose logic in seeder usually skips pre-save hooks unless using .create() carefully or user.save()
            // Using User.create checks pre-save hooks
            await User.create({
                name: "Canteen Admin",
                email: "admin@canteen.com",
                password: "admin", // Will be hashed by pre-save hook
                phone: "9999999999",
                role: "admin",
                outletId: canteen._id
            });
            console.log('Created Admin User: admin@canteen.com / admin');
        }

        if (ccd) {
            const ccdItems = ccdMenu.map(item => ({ ...item, outletId: ccd._id }));
            await MenuItem.insertMany(ccdItems);
            console.log('Added CCD menu');
        }

        // Add minimal items for others
        for (const outlet of createdOutlets) {
            if (outlet.name !== 'Main Canteen' && outlet.name !== 'Café Coffee Day') {
                await MenuItem.create({
                    outletId: outlet._id,
                    name: 'Classic Item',
                    price: 100,
                    category: outlet.categories[0] || 'General',
                    description: `Best seller at ${outlet.name}`
                });
            }
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
