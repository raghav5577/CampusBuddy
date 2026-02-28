const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Outlet = require('./models/Outlet');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

dotenv.config();

const outlets = [
    {
        name: 'Southern Stories',
        description: 'The Taste of India. Ice creams and dairy snacks.',
        location: 'Block B',
        openingTime: '10:00 AM',
        closingTime: '10:00 PM',
        averagePrepTime: 2,
        image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        categories: ['Ice Cream', 'Shakes', 'Snacks']
    },
    {
        name: 'Infinity Kitchens',
        description: 'Infinity Kitchens — Wraps, parathas, sandwiches, burgers, pasta, chai and more, all day long.',
        location: 'Student Center',
        openingTime: '08:00 AM',
        closingTime: '11:00 PM',
        averagePrepTime: 10,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        categories: ['Veg Wraps', 'Egg & Chicken Wraps', 'Sandwiches', 'Burgers', 'Parathas', 'Omelette', 'Combos', 'Beverages', 'Snacks', 'Pasta']
    },
    {
        name: 'SnapEats',
        description: 'Brewing happiness. Coffee, shakes, and light bites.',
        location: 'Library Building',
        openingTime: '09:00 AM',
        closingTime: '11:00 PM',
        averagePrepTime: 10,
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        categories: ['Coffee', 'Shakes', 'Sandwiches', 'Desserts']
    },
    {
        name: 'Subway',
        description: 'Eat Fresh. Build your own sub, wrap or salad with fresh ingredients.',
        location: 'Food Court',
        openingTime: '10:00 AM',
        closingTime: '11:00 PM',
        averagePrepTime: 5,
        image: 'https://images.unsplash.com/photo-1509722747741-090ed30b75b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80',
        categories: ['Veg Subs', 'Non-Veg Subs', 'Veg Footlongs', 'Non-Veg Footlongs', 'Wraps', 'Salads', 'Sides & Desserts']
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
        name: 'M Block Canteen',
        description: 'The heart of campus food. Biryanis, tandoori, momos, meals and beverages.',
        location: 'M Block, Ground Floor',
        openingTime: '08:00 AM',
        closingTime: '10:00 PM',
        averagePrepTime: 20,
        image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
        categories: ['Fried Rice & Noodles', 'Chinese Delicacies', 'Biryani', 'Breads', 'Rolls', 'Dessert', 'Beverages', 'Tandoori Snacks', 'Momos', 'Burgers', 'Mini Meals', 'Main Course']
    }
];

const mainCanteenMenu = [
    // --- Fried Rice & Noodles ---
    { name: 'Veg Fried Rice', price: 120, category: 'Fried Rice & Noodles', description: 'Aromatic wok-tossed rice with seasonal vegetables', prepTime: 10 },
    { name: 'Chicken Fried Rice', price: 160, category: 'Fried Rice & Noodles', description: 'Wok-tossed rice with juicy chicken pieces', prepTime: 12 },
    { name: 'Egg Fried Rice', price: 140, category: 'Fried Rice & Noodles', description: 'Wok-tossed rice with scrambled eggs', prepTime: 10 },
    { name: 'Veg Hakka Noodles', price: 120, category: 'Fried Rice & Noodles', description: 'Classic stir-fried noodles with fresh vegetables', prepTime: 10 },
    { name: 'Chicken Hakka Noodles', price: 160, category: 'Fried Rice & Noodles', description: 'Stir-fried noodles loaded with chicken', prepTime: 12 },
    { name: 'Veg Schezwan Fried Rice', price: 140, category: 'Fried Rice & Noodles', description: 'Spicy schezwan-tossed fried rice', prepTime: 10 },
    { name: 'Chicken Schezwan Fried Rice', price: 180, category: 'Fried Rice & Noodles', description: 'Spicy schezwan fried rice with chicken', prepTime: 12 },
    { name: 'Veg Chow Mein', price: 120, category: 'Fried Rice & Noodles', description: 'Pan-fried noodles with vegetables', prepTime: 10 },
    { name: 'Chicken Chow Mein', price: 160, category: 'Fried Rice & Noodles', description: 'Pan-fried noodles with chicken', prepTime: 12 },

    // --- Chinese Delicacies ---
    { name: 'CHC Chicken (Leg Pc)', price: 200, category: 'Chinese Delicacies', description: 'Crispy Chinese-style fried chicken leg piece', prepTime: 15 },
    { name: 'Chilli Chicken Dry', price: 220, category: 'Chinese Delicacies', description: 'Crispy chicken tossed with green chillies and sauces', prepTime: 15 },
    { name: 'Chilli Chicken Gravy', price: 220, category: 'Chinese Delicacies', description: 'Tender chicken in spicy chilli gravy', prepTime: 15 },
    { name: 'Chilli Paneer Dry', price: 190, category: 'Chinese Delicacies', description: 'Crispy paneer tossed with peppers and chilli sauce', prepTime: 12 },
    { name: 'Chilli Paneer Gravy', price: 190, category: 'Chinese Delicacies', description: 'Soft paneer in tangy chilli gravy', prepTime: 12 },
    { name: 'Manchurian Veg Dry', price: 170, category: 'Chinese Delicacies', description: 'Crispy veggie balls with manchurian sauce', prepTime: 12 },
    { name: 'Manchurian Veg Gravy', price: 170, category: 'Chinese Delicacies', description: 'Soft veggie balls in manchurian gravy', prepTime: 12 },

    // --- Biryani ---
    { name: 'Veg Biryani', price: 160, category: 'Biryani', description: 'Fragrant basmati rice with seasonal vegetables and whole spices', prepTime: 15 },
    { name: 'Chicken Biryani', price: 210, category: 'Biryani', description: 'Slow-cooked basmati rice with tender chicken and aromatic spices', prepTime: 20 },
    { name: 'Mutton Biryani', price: 260, category: 'Biryani', description: 'Rich and flavourful mutton biryani cooked dum style', prepTime: 25 },
    { name: 'Egg Biryani', price: 180, category: 'Biryani', description: 'Basmati biryani with spiced boiled eggs', prepTime: 15 },
    { name: 'Raita', price: 40, category: 'Biryani', description: 'Chilled yogurt with cucumber and spices', prepTime: 2 },

    // --- Breads ---
    { name: 'Tawa Roti', price: 15, category: 'Breads', description: 'Freshly made wheat roti on tawa', prepTime: 5 },
    { name: 'Butter Roti', price: 20, category: 'Breads', description: 'Soft wheat roti topped with butter', prepTime: 5 },
    { name: 'Butter Naan', price: 40, category: 'Breads', description: 'Soft tandoor-baked naan with butter', prepTime: 8 },
    { name: 'Garlic Naan', price: 50, category: 'Breads', description: 'Tandoor-baked naan topped with garlic and butter', prepTime: 8 },
    { name: 'Laccha Paratha', price: 40, category: 'Breads', description: 'Crispy layered whole-wheat paratha', prepTime: 8 },
    { name: 'Kulcha', price: 35, category: 'Breads', description: 'Soft leavened bread baked in tandoor', prepTime: 8 },
    { name: 'Garlic Bread', price: 60, category: 'Breads', description: 'Toasted bread with garlic and herb butter', prepTime: 5 },

    // --- Rolls ---
    { name: 'Veg Roll', price: 100, category: 'Rolls', description: 'Stuffed with spiced vegetables in a soft wrap', prepTime: 8 },
    { name: 'Paneer Tikka Roll', price: 130, category: 'Rolls', description: 'Grilled paneer tikka wrapped in a flaky layered roll', prepTime: 10 },
    { name: 'Soya Tikka Roll', price: 120, category: 'Rolls', description: 'Spiced soya tikka wrapped in a crispy roll', prepTime: 10 },
    { name: 'Crispy Chicken Roll', price: 150, category: 'Rolls', description: 'Crispy fried chicken strips in a flaky roll', prepTime: 10 },
    { name: 'Chicken Seekh Roll', price: 160, category: 'Rolls', description: 'Juicy seekh kabab wrapped in a layered roll with onions & chutney', prepTime: 10 },
    { name: 'Chicken Tikka Roll', price: 160, category: 'Rolls', description: 'Tender chicken tikka wrapped with onions and sauces', prepTime: 10 },

    // --- Dessert ---
    { name: 'Gulab Jamun (2 pcs)', price: 60, category: 'Dessert', description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup', prepTime: 2 },

    // --- Beverages ---
    { name: 'Fresh Brewed Coffee', price: 100, category: 'Beverages', description: 'Freshly brewed hot coffee', prepTime: 5 },
    { name: 'Specialty Coffee (Americano / Cappuccino)', price: 120, category: 'Beverages', description: 'Barista-style specialty coffee', prepTime: 5 },
    { name: 'Virgin Cocktail', price: 90, category: 'Beverages', description: 'Refreshing mocktail with seasonal flavours', prepTime: 5 },
    { name: 'Lemon Soda', price: 70, category: 'Beverages', description: 'Chilled lemon soda with a hint of mint', prepTime: 3 },
    { name: 'Lemon Water', price: 40, category: 'Beverages', description: 'Fresh lemon water with spices', prepTime: 2 },
    { name: 'Lassi', price: 70, category: 'Beverages', description: 'Thick chilled yogurt drink — sweet or salted', prepTime: 3 },
    { name: 'Tadka Butter Milk', price: 40, category: 'Beverages', description: 'Spiced chaas with curry leaf tadka', prepTime: 3 },

    // --- Tandoori Snacks (Veg) ---
    { name: 'Paneer Tikka (6 pcs)', price: 220, category: 'Tandoori Snacks', description: 'Marinated cottage cheese grilled in tandoor', prepTime: 15 },
    { name: 'Mushroom Tikka (6 pcs)', price: 200, category: 'Tandoori Snacks', description: 'Spiced mushrooms grilled to perfection', prepTime: 12 },
    { name: 'Corn Capsicum Tikka', price: 190, category: 'Tandoori Snacks', description: 'Sweet corn and capsicum skewers from the tandoor', prepTime: 12 },
    { name: 'Stuffed Bread Tikka', price: 160, category: 'Tandoori Snacks', description: 'Bread stuffed with spiced filling, grilled in tandoor', prepTime: 12 },

    // --- Tandoori Snacks (Non-Veg) ---
    { name: 'Chicken Tikka (6 pcs)', price: 260, category: 'Tandoori Snacks', description: 'Tender chicken marinated in yogurt & spices, chargrilled', prepTime: 20 },
    { name: 'Seekh Kabab (4 pcs)', price: 240, category: 'Tandoori Snacks', description: 'Spiced minced chicken kababs grilled on skewers', prepTime: 20 },
    { name: 'Chicken Malai Tikka (6 pcs)', price: 280, category: 'Tandoori Snacks', description: 'Creamy and mildly spiced chicken tikka', prepTime: 20 },
    { name: 'Chicken Tandoori (Half)', price: 260, category: 'Tandoori Snacks', description: 'Classic half tandoori chicken marinated overnight', prepTime: 25 },

    // --- Momos ---
    { name: 'Veg Steamed Momos (8 pcs)', price: 100, category: 'Momos', description: 'Soft steamed dumplings stuffed with spiced vegetables', prepTime: 15 },
    { name: 'Veg Fried Momos (8 pcs)', price: 120, category: 'Momos', description: 'Crispy pan-fried dumplings with veg filling', prepTime: 15 },
    { name: 'Chicken Steamed Momos (8 pcs)', price: 140, category: 'Momos', description: 'Juicy steamed dumplings with chicken filling', prepTime: 15 },
    { name: 'Chicken Fried Momos (8 pcs)', price: 160, category: 'Momos', description: 'Crispy fried dumplings with chicken filling', prepTime: 15 },
    { name: 'Tandoori Chicken Momos (8 pcs)', price: 180, category: 'Momos', description: 'Spiced chicken momos grilled in tandoor with chutney', prepTime: 20 },
    { name: 'Veg Schezwan Momos (8 pcs)', price: 130, category: 'Momos', description: 'Steamed veg momos tossed in spicy schezwan sauce', prepTime: 15 },

    // --- Burgers ---
    { name: 'Veg Burger', price: 90, category: 'Burgers', description: 'Crispy veggie patty with fresh veggies and sauces', prepTime: 8 },
    { name: 'Paneer Tikka Burger', price: 130, category: 'Burgers', description: 'Grilled paneer tikka patty in a sesame bun', prepTime: 10 },
    { name: 'Chicken Burger', price: 130, category: 'Burgers', description: 'Juicy chicken patty with lettuce, tomato and mayo', prepTime: 10 },
    { name: 'Chicken Zinger Burger', price: 160, category: 'Burgers', description: 'Spicy crispy chicken fillet burger', prepTime: 12 },
    { name: 'Cheese Burger', price: 110, category: 'Burgers', description: 'Classic burger with a melted cheese slice', prepTime: 10 },

    // --- Mini Meals ---
    { name: 'Veg Mini Meal', price: 160, category: 'Mini Meals', description: 'Dal + Sabzi + Basmati Rice + 2 Roti + Raita + Salad', prepTime: 10 },
    { name: 'Non-Veg Mini Meal', price: 210, category: 'Mini Meals', description: 'Chicken Curry + Basmati Rice + 2 Roti + Raita + Salad', prepTime: 12 },
    { name: 'Veg Rice & Noodle Bowl', price: 130, category: 'Mini Meals', description: 'Choice of fried rice or noodles with veg sides', prepTime: 10 },
    { name: 'Chicken Rice & Noodle Bowl', price: 170, category: 'Mini Meals', description: 'Choice of chicken fried rice or noodles with sides', prepTime: 12 },
    { name: 'Amritsari Kulcha Combo', price: 130, category: 'Mini Meals', description: '2 stuffed kulcha + chole + green chutney + onion salad', prepTime: 12 },

    // --- Main Course (Veg) ---
    { name: 'Dal Tadka', price: 140, category: 'Main Course', description: 'Yellow lentil tempered with ghee, garlic and cumin', prepTime: 10 },
    { name: 'Dal Makhani', price: 170, category: 'Main Course', description: 'Slow-cooked black lentils in buttery tomato gravy', prepTime: 15 },
    { name: 'Mix Vegetable', price: 160, category: 'Main Course', description: 'Seasonal vegetables cooked in spiced onion-tomato gravy', prepTime: 12 },
    { name: 'Aloo Gobhi', price: 150, category: 'Main Course', description: 'Potato and cauliflower cooked with ginger and spices', prepTime: 12 },
    { name: 'Paneer Butter Masala', price: 210, category: 'Main Course', description: 'Cottage cheese in rich buttery tomato gravy', prepTime: 15 },
    { name: 'Shahi Paneer', price: 220, category: 'Main Course', description: 'Paneer in a royal cashew and cream gravy', prepTime: 15 },
    { name: 'Kadai Paneer', price: 210, category: 'Main Course', description: 'Paneer and capsicum in spiced kadai masala gravy', prepTime: 15 },
    { name: 'Palak Paneer', price: 200, category: 'Main Course', description: 'Spinach puree with soft paneer cubes', prepTime: 15 },

    // --- Main Course (Non-Veg) ---
    { name: 'Egg Curry', price: 160, category: 'Main Course', description: 'Boiled eggs in a spiced onion-tomato gravy', prepTime: 12 },
    { name: 'Chicken Curry', price: 220, category: 'Main Course', description: 'Home-style chicken in aromatic masala gravy', prepTime: 20 },
    { name: 'Chicken Butter Masala', price: 250, category: 'Main Course', description: 'Tender chicken in smooth buttery tomato gravy', prepTime: 20 },
    { name: 'Kadai Chicken', price: 240, category: 'Main Course', description: 'Chicken cooked with chunky peppers in kadai masala', prepTime: 20 },
    { name: 'Mutton Curry', price: 290, category: 'Main Course', description: 'Slow-cooked mutton pieces in rich spicy gravy', prepTime: 30 },
    { name: 'Chicken Keema', price: 210, category: 'Main Course', description: 'Spiced minced chicken cooked with peas and spices', prepTime: 18 },
];

const snapEatsMenu = [
    { name: 'Cold Coffee', price: 100, category: 'Coffee', description: 'Chilled coffee with ice cream', prepTime: 5 },
    { name: 'Oreo Shake', price: 120, category: 'Shakes', description: 'Thick shake with oreo crumbs', prepTime: 5 },
    { name: 'Chicken Sandwich', price: 90, category: 'Sandwiches', description: 'Grilled chicken with mayo', prepTime: 10 },
    { name: 'Brownie', price: 80, category: 'Desserts', description: 'Warm walnut brownie', prepTime: 2 },
];

const subwayMenu = [
    // --- Veg Subs (6-inch) ---
    { name: 'Veggie Delite (6-inch)', price: 209, category: 'Veg Subs', description: 'Crisp lettuce, tomatoes, cucumbers, capsicum & olives on freshly baked bread', prepTime: 5 },
    { name: 'Aloo Patty (6-inch)', price: 229, category: 'Veg Subs', description: 'Seasoned potato patty with fresh veggies on your choice of bread', prepTime: 5 },
    { name: 'Paneer Tikka (6-inch)', price: 299, category: 'Veg Subs', description: 'Tandoor-marinated paneer cubes with crunchy veggies and mint chutney', prepTime: 5 },
    { name: 'Corn & Peas (6-inch)', price: 269, category: 'Veg Subs', description: 'Sweet corn and tender peas with crisp fresh vegetables', prepTime: 5 },
    { name: 'Chatpata Chaat (6-inch)', price: 269, category: 'Veg Subs', description: 'Tangy chaat-spiced filling with crunchy sev and fresh veggies', prepTime: 5 },
    { name: 'Schezwan Veggie (6-inch)', price: 289, category: 'Veg Subs', description: 'Spicy stir-fried schezwan vegetables loaded on a fresh sub', prepTime: 5 },
    { name: 'Hara Bhara Kebab (6-inch)', price: 279, category: 'Veg Subs', description: 'Green spinach and pea kebab patty with fresh toppings', prepTime: 5 },

    // --- Non-Veg Subs (6-inch) ---
    { name: 'Chicken Teriyaki (6-inch)', price: 329, category: 'Non-Veg Subs', description: 'Sweet and smoky teriyaki-glazed chicken strips with fresh veggies', prepTime: 5 },
    { name: 'Chicken Tikka (6-inch)', price: 339, category: 'Non-Veg Subs', description: 'Spiced tandoor-style chicken tikka with mint mayo and fresh vegetables', prepTime: 5 },
    { name: 'Roasted Chicken (6-inch)', price: 329, category: 'Non-Veg Subs', description: 'Oven-roasted tender chicken slices with crisp lettuce and tomatoes', prepTime: 5 },
    { name: 'Chicken BMT (6-inch)', price: 359, category: 'Non-Veg Subs', description: 'Chicken salami, chicken ham and chicken pepperoni with veggies', prepTime: 5 },
    { name: 'Chicken Seekh Kebab (6-inch)', price: 349, category: 'Non-Veg Subs', description: 'Juicy minced chicken seekh kebab with onions and chutney', prepTime: 5 },
    { name: 'Chicken Meatball (6-inch)', price: 329, category: 'Non-Veg Subs', description: 'Tender chicken meatballs in marinara sauce with melted cheese', prepTime: 7 },
    { name: 'Tuna (6-inch)', price: 319, category: 'Non-Veg Subs', description: 'Classic tuna salad with crisp lettuce and fresh vegetables', prepTime: 5 },
    { name: 'Egg & Cheese (6-inch)', price: 299, category: 'Non-Veg Subs', description: 'Scrambled egg patty with melted cheese and fresh toppings', prepTime: 5 },

    // --- Veg Footlongs ---
    { name: 'Veggie Delite (Footlong)', price: 369, category: 'Veg Footlongs', description: 'Double the freshness — crisp lettuce, tomatoes, cucumbers, capsicum & olives', prepTime: 7 },
    { name: 'Aloo Patty (Footlong)', price: 399, category: 'Veg Footlongs', description: 'Double-portion seasoned potato patty with fresh veggies on 12-inch bread', prepTime: 7 },
    { name: 'Paneer Tikka (Footlong)', price: 519, category: 'Veg Footlongs', description: 'Extra-generous tandoor-marinated paneer on a 12-inch freshly baked bread', prepTime: 7 },
    { name: 'Corn & Peas (Footlong)', price: 479, category: 'Veg Footlongs', description: 'Footlong loaded with sweet corn, peas and fresh crunchy vegetables', prepTime: 7 },
    { name: 'Chatpata Chaat (Footlong)', price: 479, category: 'Veg Footlongs', description: 'Tangy chaat-spiced footlong with sev and fresh garden veggies', prepTime: 7 },

    // --- Non-Veg Footlongs ---
    { name: 'Chicken Teriyaki (Footlong)', price: 579, category: 'Non-Veg Footlongs', description: 'Teriyaki-glazed chicken strips on a full 12-inch freshly baked sub', prepTime: 7 },
    { name: 'Chicken Tikka (Footlong)', price: 599, category: 'Non-Veg Footlongs', description: 'Spiced chicken tikka loaded on a 12-inch bread with fresh toppings', prepTime: 7 },
    { name: 'Roasted Chicken (Footlong)', price: 579, category: 'Non-Veg Footlongs', description: 'Double-portion oven-roasted chicken on a 12-inch freshly baked bread', prepTime: 7 },
    { name: 'Chicken BMT (Footlong)', price: 629, category: 'Non-Veg Footlongs', description: 'Footlong packed with chicken salami, ham and pepperoni', prepTime: 7 },
    { name: 'Chicken Seekh Kebab (Footlong)', price: 609, category: 'Non-Veg Footlongs', description: 'Footlong loaded with juicy minced chicken seekh kebab', prepTime: 7 },

    // --- Wraps ---
    { name: 'Paneer Tikka Wrap', price: 319, category: 'Wraps', description: 'Tandoor-marinated paneer with fresh veggies and sauces in a toasted wrap', prepTime: 5 },
    { name: 'Chatpata Chaat Wrap', price: 289, category: 'Wraps', description: 'Tangy chaat-spiced filling with sev wrapped in a warm tortilla', prepTime: 5 },
    { name: 'Corn & Peas Wrap', price: 289, category: 'Wraps', description: 'Sweet corn and peas with fresh garden veggies in a toasted wrap', prepTime: 5 },
    { name: 'Chicken Tikka Wrap', price: 359, category: 'Wraps', description: 'Spiced chicken tikka with mint mayo and crunchy veggies in a tortilla', prepTime: 5 },
    { name: 'Chicken Teriyaki Wrap', price: 349, category: 'Wraps', description: 'Teriyaki-glazed chicken strips with fresh veggies in a toasted wrap', prepTime: 5 },
    { name: 'Chicken Seekh Kebab Wrap', price: 369, category: 'Wraps', description: 'Juicy seekh kebab with fresh onions and chutney in a warm wrap', prepTime: 5 },
    { name: 'Roasted Chicken Wrap', price: 349, category: 'Wraps', description: 'Oven-roasted tender chicken with lettuce and sauces in a tortilla', prepTime: 5 },

    // --- Salads ---
    { name: 'Veggie Delite Salad', price: 199, category: 'Salads', description: 'A bowl of fresh garden vegetables with your choice of dressing', prepTime: 3 },
    { name: 'Paneer Tikka Salad', price: 279, category: 'Salads', description: 'Marinated paneer tikka on a bed of crisp fresh vegetables', prepTime: 3 },
    { name: 'Chicken Tikka Salad', price: 309, category: 'Salads', description: 'Grilled chicken tikka on a bed of fresh greens with choice of dressing', prepTime: 3 },
    { name: 'Roasted Chicken Salad', price: 299, category: 'Salads', description: 'Tender roasted chicken slices over fresh crunchy salad greens', prepTime: 3 },

    // --- Sides & Desserts ---
    { name: 'Choco Chip Cookie', price: 69, category: 'Sides & Desserts', description: 'Freshly baked soft cookie loaded with chocolate chips', prepTime: 0 },
    { name: 'Oatmeal Raisin Cookie', price: 69, category: 'Sides & Desserts', description: 'Freshly baked cookie with plump raisins and wholesome oats', prepTime: 0 },
    { name: 'Double Chocolate Cookie', price: 69, category: 'Sides & Desserts', description: 'Rich double chocolate freshly baked soft cookie', prepTime: 0 },
    { name: 'Hash Browns', price: 89, category: 'Sides & Desserts', description: 'Crispy golden hash brown bites', prepTime: 5 },
    { name: 'Nachos', price: 119, category: 'Sides & Desserts', description: 'Crunchy tortilla chips with salsa dip', prepTime: 3 },
    { name: 'Fountain Drink (Regular)', price: 79, category: 'Sides & Desserts', description: 'Choice of soft drink — Cola, Lime, Orange or Soda', prepTime: 1 },
    { name: 'Fountain Drink (Large)', price: 99, category: 'Sides & Desserts', description: 'Large soft drink — Cola, Lime, Orange or Soda', prepTime: 1 },
];

const houseOfChowMenu = [
    { name: 'Hakka Noodles', price: 150, category: 'Noodles', description: 'Classic stir-fried noodles', prepTime: 10 },
    { name: 'Chilli Chicken', price: 220, category: 'Appetizers', description: 'Spicy wok-tossed chicken', prepTime: 15 },
    { name: 'Veg Fried Rice', price: 160, category: 'Rice', description: 'Aromatic basmati rice with veggies', prepTime: 12 },
    { name: 'Chicken Dimsums', price: 180, category: 'Dimsums', description: 'Steamed dumplings (6 pcs)', prepTime: 15 },
    { name: 'Spring Rolls', price: 120, category: 'Appetizers', description: 'Crispy rolls with sweet chili sauce', prepTime: 10 },
];

const infinityMenu = [
    // --- Veg Wraps ---
    { name: 'Soya Chap Wrap', price: 116, category: 'Veg Wraps', description: 'Spiced soya chap wrapped in a soft layered roll', prepTime: 10 },
    { name: 'Paneer Tikka Wrap', price: 137, category: 'Veg Wraps', description: 'Grilled paneer tikka wrapped with onions and chutney', prepTime: 10 },
    { name: 'Paneer Bhuji Wrap', price: 137, category: 'Veg Wraps', description: 'Crumbled spiced paneer bhurji in a soft roll', prepTime: 10 },
    { name: 'Paneer Shawarma', price: 147, category: 'Veg Wraps', description: 'Marinated paneer with veggies and garlic sauce in a wrap', prepTime: 10 },
    { name: 'Paneer Makhani Wrap', price: 152, category: 'Veg Wraps', description: 'Paneer in rich makhani sauce wrapped in a flaky roll', prepTime: 12 },
    { name: 'Paneer Schezwan Wrap', price: 152, category: 'Veg Wraps', description: 'Spicy schezwan paneer tossed and wrapped', prepTime: 12 },

    // --- Egg & Chicken Wraps ---
    { name: 'Egg Wrap (2 Egg)', price: 95, category: 'Egg & Chicken Wraps', description: 'Two eggs with spices wrapped in a soft roll', prepTime: 8 },
    { name: 'Noodles Egg Wrap', price: 116, category: 'Egg & Chicken Wraps', description: 'Egg and stir-fried noodles wrapped together', prepTime: 10 },
    { name: 'Paneer Egg Wrap', price: 152, category: 'Egg & Chicken Wraps', description: 'Egg and paneer combo in a spiced roll', prepTime: 10 },
    { name: 'Chicken Kabab Wrap', price: 189, category: 'Egg & Chicken Wraps', description: 'Minced chicken kabab with onions and mint chutney', prepTime: 12 },
    { name: 'Chicken Tikka Wrap', price: 189, category: 'Egg & Chicken Wraps', description: 'Tandoor-grilled chicken tikka wrapped with sauces', prepTime: 12 },
    { name: 'Chicken Noodles Wrap', price: 189, category: 'Egg & Chicken Wraps', description: 'Stir-fried chicken noodles rolled in a crispy wrap', prepTime: 12 },
    { name: 'Chicken Makhani Wrap', price: 189, category: 'Egg & Chicken Wraps', description: 'Tender chicken in makhani sauce wrapped in a roll', prepTime: 12 },
    { name: 'Chicken Shawarma', price: 189, category: 'Egg & Chicken Wraps', description: 'Spiced chicken with garlic sauce and vegetables', prepTime: 12 },
    { name: 'Chicken Achari Wrap', price: 189, category: 'Egg & Chicken Wraps', description: 'Tangy pickled-spice chicken rolled in a layered wrap', prepTime: 12 },

    // --- Sandwiches (Chicken) ---
    { name: 'Chicken Tikka Sandwich', price: 158, category: 'Sandwiches', description: 'Grilled chicken tikka with veggies in toasted bread', prepTime: 10 },
    { name: 'Chicken Keema Sandwich', price: 158, category: 'Sandwiches', description: 'Spiced minced chicken filling in toasted bread', prepTime: 10 },
    { name: 'Chicken Schezwan Sandwich', price: 158, category: 'Sandwiches', description: 'Chicken tossed in schezwan sauce with veggies', prepTime: 10 },
    { name: 'Chicken Makhni Sandwich', price: 158, category: 'Sandwiches', description: 'Soft makhani chicken loaded in a toasted sandwich', prepTime: 10 },
    { name: 'Chicken Kebab Sandwich', price: 179, category: 'Sandwiches', description: 'Juicy chicken kebab pieces in a grilled sandwich', prepTime: 12 },
    { name: 'Chicken Salami Sandwich', price: 179, category: 'Sandwiches', description: 'Chicken salami with fresh veggies and mustard', prepTime: 8 },
    { name: 'Tandoori Tikka Sandwich', price: 179, category: 'Sandwiches', description: 'Tandoor-smoked chicken tikka in a toasted roll', prepTime: 12 },
    // --- Sandwiches (Veg) ---
    { name: 'Aloo Tikki Sandwich', price: 95, category: 'Sandwiches', description: 'Crispy aloo tikki in a toasted sandwich', prepTime: 8 },
    { name: 'Cheese Grilled Sandwich', price: 95, category: 'Sandwiches', description: 'Classic grilled sandwich loaded with melted cheese', prepTime: 8 },
    { name: 'Cheese Pizza Grilled Sandwich', price: 126, category: 'Sandwiches', description: 'Pizza-style grilled sandwich with cheese and toppings', prepTime: 10 },
    { name: 'Cheese Corn Sandwich', price: 126, category: 'Sandwiches', description: 'Sweet corn and cheese in a grilled sandwich', prepTime: 8 },
    { name: 'Tandoori Soya Sandwich', price: 126, category: 'Sandwiches', description: 'Spiced tandoori soya chunks in a grilled sandwich', prepTime: 10 },
    { name: 'Paneer Masala Sandwich', price: 126, category: 'Sandwiches', description: 'Spiced paneer masala filling in a grilled sandwich', prepTime: 10 },
    { name: 'Paneer Makhani Sandwich', price: 147, category: 'Sandwiches', description: 'Rich makhani paneer loaded in a toasted sandwich', prepTime: 10 },
    { name: 'Veg Grilled Sandwich', price: 73, category: 'Sandwiches', description: 'Classic grilled sandwich with fresh vegetables', prepTime: 8 },
    { name: 'Crispy Veg Sandwich', price: 94, category: 'Sandwiches', description: 'Crunchy crumbed veg filling in toasted bread', prepTime: 8 },
    { name: 'Jungle Paneer Sandwich', price: 94, category: 'Sandwiches', description: 'Loaded paneer and veggies in a grilled sandwich', prepTime: 10 },
    { name: 'Crispy Paneer Sandwich', price: 104, category: 'Sandwiches', description: 'Crispy fried paneer with sauces in toasted bread', prepTime: 10 },

    // --- Burgers ---
    { name: 'Chicken Burger', price: 137, category: 'Burgers', description: 'Juicy chicken patty with lettuce, tomato and mayo', prepTime: 10 },
    { name: 'Chicken Tikka Burger', price: 147, category: 'Burgers', description: 'Spiced chicken tikka patty in a sesame bun', prepTime: 10 },
    { name: 'Chicken Makhni Burger', price: 147, category: 'Burgers', description: 'Chicken patty glazed with makhani sauce', prepTime: 10 },
    { name: 'Veg Burger', price: 63, category: 'Burgers', description: 'Crispy veggie patty with fresh veggies and sauces', prepTime: 8 },
    { name: 'Crispy Paneer Burger', price: 116, category: 'Burgers', description: 'Crispy paneer patty in a soft bun with sauces', prepTime: 10 },
    { name: 'Maharaja Burger', price: 140, category: 'Burgers', description: 'Double-stacked loaded burger with special sauce', prepTime: 12 },

    // --- Parathas ---
    { name: 'Aloo Paratha', price: 75, category: 'Parathas', description: 'Stuffed whole-wheat paratha with spiced potato filling', prepTime: 8 },
    { name: 'Aloo Pyaz Paratha', price: 75, category: 'Parathas', description: 'Paratha stuffed with aloo and caramelised onions', prepTime: 8 },
    { name: 'Pyaz Paratha', price: 75, category: 'Parathas', description: 'Crispy paratha with spiced onion filling', prepTime: 8 },
    { name: 'Mix Paratha', price: 75, category: 'Parathas', description: 'Paratha stuffed with a mix of potato and vegetables', prepTime: 8 },
    { name: 'Paneer Paratha', price: 95, category: 'Parathas', description: 'Whole-wheat paratha stuffed with crumbled spiced paneer', prepTime: 10 },
    { name: 'Egg Paratha', price: 95, category: 'Parathas', description: 'Egg-coated crispy paratha', prepTime: 8 },
    { name: 'Aloo Paneer Paratha', price: 95, category: 'Parathas', description: 'Paratha stuffed with aloo and paneer mix', prepTime: 10 },
    { name: 'Paneer Pyaz Paratha', price: 95, category: 'Parathas', description: 'Paratha filled with paneer and crispy onions', prepTime: 10 },
    { name: 'Gobhi Paratha', price: 75, category: 'Parathas', description: 'Whole-wheat paratha stuffed with spiced cauliflower', prepTime: 8 },
    { name: 'Choly Bhature', price: 90, category: 'Parathas', description: 'Fluffy bhature served with spicy chole', prepTime: 10 },
    { name: 'Poori Sabji', price: 50, category: 'Parathas', description: 'Soft puffed poori with seasonal sabji', prepTime: 8 },
    { name: 'Kachori Sabji', price: 50, category: 'Parathas', description: 'Crispy kachori served with sabji', prepTime: 8 },
    { name: 'Samosa Choly', price: 50, category: 'Parathas', description: 'Crispy samosa served with spicy chole', prepTime: 5 },

    // --- Omelette ---
    { name: 'Bread Omelette', price: 63, category: 'Omelette', description: 'Fluffy omelette served with buttered toast', prepTime: 8 },
    { name: 'Masala Omelette', price: 58, category: 'Omelette', description: 'Spiced omelette with onion, tomato and green chilli', prepTime: 8 },
    { name: 'Plain Omelette', price: 58, category: 'Omelette', description: 'Classic plain omelette', prepTime: 5 },
    { name: 'Cheese Omelette', price: 93, category: 'Omelette', description: 'Fluffy omelette loaded with melted cheese', prepTime: 8 },

    // --- Combos ---
    { name: 'Kadahi Paneer + 2pc Lachha Paratha', price: 180, category: 'Combos', description: 'Rich kadahi paneer gravy served with two crispy lachha parathas', prepTime: 12 },
    { name: 'Kadahi Chap + 2pc Lachha Paratha', price: 180, category: 'Combos', description: 'Spiced soya chap in kadahi masala with two lachha parathas', prepTime: 12 },
    { name: 'Dal Makhni + 2pc Lachha Paratha', price: 180, category: 'Combos', description: 'Slow-cooked dal makhni served with two lachha parathas', prepTime: 12 },

    // --- Beverages ---
    { name: 'Adrak Chai', price: 16, category: 'Beverages', description: 'Hot ginger tea (Regular)', prepTime: 5 },
    { name: 'Masala Chai', price: 16, category: 'Beverages', description: 'Spiced masala tea (Regular)', prepTime: 5 },
    { name: 'Kadak Elaichi Chai', price: 21, category: 'Beverages', description: 'Strong cardamom tea (Regular)', prepTime: 5 },
    { name: 'Lemon Tea', price: 21, category: 'Beverages', description: 'Refreshing hot lemon tea (Regular)', prepTime: 5 },
    { name: 'Hot / Black Coffee', price: 45, category: 'Beverages', description: 'Freshly brewed hot or black coffee (Regular)', prepTime: 5 },
    { name: 'Cold Coffee', price: 69, category: 'Beverages', description: 'Chilled blended cold coffee (Regular)', prepTime: 5 },
    { name: 'Caramel / Hazelnut Cold Coffee', price: 104, category: 'Beverages', description: 'Cold coffee with caramel or hazelnut syrup', prepTime: 5 },
    { name: 'Irish / Brownie Cold Coffee', price: 147, category: 'Beverages', description: 'Indulgent cold coffee with Irish or brownie flavour', prepTime: 5 },

    // --- Snacks ---
    { name: 'Veg Patty', price: 32, category: 'Snacks', description: 'Crispy spiced vegetable patty', prepTime: 5 },
    { name: 'Paneer Patty', price: 42, category: 'Snacks', description: 'Soft paneer-filled crispy patty', prepTime: 5 },
    { name: 'Aloo Samosa', price: 20, category: 'Snacks', description: 'Classic crispy samosa with spiced potato filling', prepTime: 3 },
    { name: 'Garlic Toast with Cheese (2pc)', price: 68, category: 'Snacks', description: 'Two toasted garlic bread slices loaded with cheese', prepTime: 5 },
    { name: 'Exotic Garlic Toast (2pc)', price: 79, category: 'Snacks', description: 'Two garlic toast slices with exotic herb toppings', prepTime: 5 },

    // --- Pasta ---
    { name: 'White Sauce Pasta', price: 105, category: 'Pasta', description: 'Creamy béchamel pasta with herbs', prepTime: 12 },
    { name: 'Red Sauce Pasta', price: 105, category: 'Pasta', description: 'Tangy tomato-based pasta with Italian seasoning', prepTime: 12 },
    { name: 'Mix Sauce Pasta', price: 126, category: 'Pasta', description: 'Pasta tossed in a blend of white and red sauce', prepTime: 12 },
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

        const infinity = findOutlet('Infinity Kitchens');
        if (infinity) {
            await MenuItem.insertMany(infinityMenu.map(item => ({ ...item, outletId: infinity._id })));
            await createAdmin(infinity, "Infinity Kitchens Admin", "admin@infinity.com");
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
