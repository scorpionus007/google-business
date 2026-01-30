export const BUSINESS_CONFIG = {
    "Restaurant": {
        labels: {
            inventory: "Menu Management",
            item: "Dish",
            addBtn: "Add Dish",
            stock: "Daily Availability"
        },
        categories: ["Starter", "Main Course", "Dessert", "Beverage", "Specials"],
        defaultItems: ["Butter Chicken", "Paneer Tikka", "Fried Rice", "Cola"]
    },
    "Hotel": {
        labels: {
            inventory: "Room & Service Management",
            item: "Room/Service",
            addBtn: "Add Room Type",
            stock: "Rooms Available"
        },
        categories: ["Deluxe Room", "Suite", "Standard Room", "Room Service", "Laundry"],
        defaultItems: ["Single Bed AC", "Double Bed Non-AC", "Breakfast Buffet"]
    },
    "Hospital / Clinic": {
        labels: {
            inventory: "Service & Treatment Catalog",
            item: "Service",
            addBtn: "Add Treatment",
            stock: "Slots/Capacity"
        },
        categories: ["Consultation", "Surgery", "Emergency", "Ward", "Checkup"],
        defaultItems: ["General Consultation", "Dental Cleaning", "Blood Pressure Check"]
    },
    "Pathology Lab": {
        labels: {
            inventory: "Test Directory",
            item: "Test",
            addBtn: "Add Test",
            stock: "Daily Capacity"
        },
        categories: ["Blood Test", "Urine Analysis", "X-Ray", "Scan", "Package"],
        defaultItems: ["Complete Blood Count (CBC)", "Diabetes Screen", "Thyroid Profile"]
    },
    "Retail Shop (General)": {
        labels: {
            inventory: "Product Inventory",
            item: "Product",
            addBtn: "Add Product",
            stock: "Stock Quantity"
        },
        categories: ["FMCG", "Household", "Personal Care", "Snacks", "Stationery"],
        defaultItems: ["Soap", "Toothpaste", "Rice 5kg", "Notebook"]
    },
    "Grocery Store": {
        labels: {
            inventory: "Grocery Stock",
            item: "Item",
            addBtn: "Add Item",
            stock: "Quantity (kg/units)"
        },
        categories: ["Fruits", "Vegetables", "Grains", "Spices", "Dairy"],
        defaultItems: ["Potato", "Onion", "Milk", "Wheat Flour"]
    },
    "Clothing / Boutique": {
        labels: {
            inventory: "Apparel Collection",
            item: "Apparel",
            addBtn: "Add Design",
            stock: "Pieces Available"
        },
        categories: ["Men", "Women", "Kids", "Accessories", "Footwear"],
        defaultItems: ["T-Shirt", "Jeans", "Saree", "Kurta"]
    },
    "Tuition / Coaching": {
        labels: {
            inventory: "Course Management",
            item: "Course",
            addBtn: "Add Course",
            stock: "Seats Available"
        },
        categories: ["Mathematics", "Science", "Languages", "Arts", "Competitive Exams"],
        defaultItems: ["Class 10 Math", "Physics Crash Course", "Spoken English"]
    },
    "Salon / Spa": {
        labels: {
            inventory: "Service Menu",
            item: "Service",
            addBtn: "Add Service",
            stock: "Staff Available"
        },
        categories: ["Haircut", "Facial", "Massage", "Manicure/Pedicure", "Bridal"],
        defaultItems: ["Men's Haircut", "Gold Facial", "Head Massage"]
    },
    "Pharmacy": {
        labels: {
            inventory: "Medicine Stock",
            item: "Medicine",
            addBtn: "Add Medicine",
            stock: "Units in Stock"
        },
        categories: ["Tablet", "Syrup", "Injection", "Ointment", "Surgical"],
        defaultItems: ["Paracetamol", "Cough Syrup", "Bandage"]
    },
    "Gym / Fitness": {
        labels: {
            inventory: "Membership & Plans",
            item: "Plan",
            addBtn: "Add Plan",
            stock: "Active Members"
        },
        categories: ["Monthly", "Quarterly", "Annual", "Personal Training", "Yoga"],
        defaultItems: ["Gold Membership", "Cardio Session", "Zumba Class"]
    },
    "Electronics Store": {
        labels: {
            inventory: "Gadget Inventory",
            item: "Device",
            addBtn: "Add Device",
            stock: "Units in Stock"
        },
        categories: ["Mobile", "Laptop", "Accessories", "Home Appliance", "Camera"],
        defaultItems: ["Samsung Galaxy", "USB Cable", "Smart TV"]
    },
    "Automobile Garage": {
        labels: {
            inventory: "Service & Parts",
            item: "Service/Part",
            addBtn: "Add Service",
            stock: "Stock/Bay"
        },
        categories: ["Car Wash", "Repair", "Oil Change", "Spare Parts", "Tyres"],
        defaultItems: ["General Service", "Engine Oil 5W30", "Wheel Alignment"]
    },
    "Real Estate Agency": {
        labels: {
            inventory: "Property Listings",
            item: "Property",
            addBtn: "Add Property",
            stock: "Available Units"
        },
        categories: ["Apartment", "Villa", "Plot", "Commercial", "Rent"],
        defaultItems: ["2BHK Apartment", "Office Space", "3BHK Villa"]
    },
    "Bakery / Cafe": {
        labels: {
            inventory: "Menu Items",
            item: "Item",
            addBtn: "Add Item",
            stock: "Daily Fresh Stock"
        },
        categories: ["Cake", "Pastry", "Bread", "Beverage", "Snacks"],
        defaultItems: ["Black Forest Cake", "Croissant", "Cappuccino"]
    },
    "Jewelry Store": {
        labels: {
            inventory: "Jewelry Collection",
            item: "Jewelry",
            addBtn: "Add Piece",
            stock: "Pieces Available"
        },
        categories: ["Gold", "Silver", "Diamond", "Platinum", "Gemstones"],
        defaultItems: ["Gold Ring", "Silver Anklet", "Diamond Pendant"]
    },
    "Hardware Store": {
        labels: {
            inventory: "Hardware Stock",
            item: "Tool/Material",
            addBtn: "Add Item",
            stock: "Quantity"
        },
        categories: ["Tools", "Paint", "Plumbing", "Electrical", "Fixtures"],
        defaultItems: ["Hammer", "White Paint 1L", "LED Bulb"]
    }
};

export const getBusinessConfig = (category) => {
    return BUSINESS_CONFIG[category] || BUSINESS_CONFIG["Retail Shop (General)"];
};
