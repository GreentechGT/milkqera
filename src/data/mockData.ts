export const CATEGORIES = [
    { id: 'milk', name: 'Milk' },
    { id: 'ghee', name: 'Ghee' },
    { id: 'butter', name: 'Butter' },
    { id: 'curd', name: 'Curd' },
    { id: 'paneer', name: 'Paneer' },
    { id: 'eggs', name: 'Eggs' },
    { id: 'organic', name: 'Organic' },
    { id: 'organic', name: 'Organic' },
];

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: any;
    category: string;
    defaultQuantity: string;
    discount?: string;
}

export const PRODUCTS: Product[] = [
    // --- MILK ---
    {
        id: 1,
        name: 'Fresh Cow Milk',
        description: 'Organic whole cow milk, pasteurized and chilled.',
        price: 65,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Milk',
        defaultQuantity: '1L',
        discount: '10%'
    },
    {
        id: 2,
        name: 'Creamy Buffalo Milk',
        description: 'High-fat buffalo milk, perfect for tea and desserts.',
        price: 85,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Milk',
        defaultQuantity: '1L'
    },
    {
        id: 3,
        name: 'A2 Desi Cow Milk',
        description: 'Premium A2 milk from indigenous cow breeds.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Milk',
        defaultQuantity: '500ml'
    },

    // --- CURD & PANEER ---
    {
        id: 4,
        name: 'Probiotic Curd',
        description: 'Thick, creamy curd with active cultures.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Curd',
        defaultQuantity: '500g'
    },
    {
        id: 5,
        name: 'Fresh Malai Paneer',
        description: 'Soft, melt-in-the-mouth cottage cheese cubes.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1604908554007-7f9d1b9f7c3f?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Paneer',
        defaultQuantity: '200g'
    },

    // --- BUTTER & GHEE ---
    {
        id: 6,
        name: 'Farmstead Butter',
        description: 'Hand-churned unsalted white butter.',
        price: 210,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Butter',
        defaultQuantity: '250g'
    },
    {
        id: 7,
        name: 'Pure Desi Ghee',
        description: 'Traditional Bilona method clarified butter.',
        price: 650,
        image: 'https://images.unsplash.com/photo-1615485737651-0e87d99f3c4f?auto=format&fit=crop&w=600&h=600&q=80'
        ,
        category: 'Ghee',
        defaultQuantity: '500ml'
    },

    // --- OTHERS ---
    {
        id: 8,
        name: 'Farm Fresh Brown Eggs',
        description: 'Antibiotic-free, protein-rich farm eggs.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Eggs',
        defaultQuantity: '6 pcs'
    },
    {
        id: 9,
        name: 'Chocolate Milkshake',
        description: 'Rich Belgian chocolate blended with fresh milk.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Beverages',
        defaultQuantity: '200ml'
    },
    {
        id: 10,
        name: 'Greek Yogurt (Berry)',
        description: 'High protein yogurt with real blueberry bits.',
        price: 60,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Curd',
        defaultQuantity: '120g'
    }
];

export const BANNERS = [
    {
        id: 1,
        title: "Fresh Milk Daily",
        subtitle: "Subscribe & Save 10% Every Month",
        color: "bg-blue-600",
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
        productIds: [1, 2, 3]
    },
    {
        id: 2,
        title: "Traditional Ghee",
        subtitle: "The Purity of Bilona Method",
        color: "bg-orange-500",
        image: 'https://images.unsplash.com/photo-1625944525335-473db7a5f4c5?auto=format&fit=crop&w=600&h=600&q=80',
        productIds: [7]
    },
    {
        id: 3,
        title: "Breakfast Essentials",
        subtitle: "Eggs & Butter Delivered by 7 AM",
        color: "bg-green-600",
        image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80",
        productIds: [6, 8]
    },
    {
        id: 4,
        title: "Summer Chills",
        subtitle: "Refreshing Beverages & Yogurts",
        color: "bg-purple-500",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
        productIds: [9, 10]
    },
];

export const SUBSCRIPTION_PLANS = [
    {
        id: 'daily_1',
        title: 'Daily Fresh Cow Milk',
        description: '100% pure farm fresh milk delivered every morning.',
        price: 30.00,
        unit: 'Daily',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABTKJzYp-VFRqTsnYScRizoBhzYgqbi2Pg1WWwcuzWvFpyKg_WLY5DXP6KbRFzRC8nX6OHBK_zrtPBvMAhtpajpq-zT8OFuJznOAzl9mtwSzkSV2b0qQpVd8QeN3euvD_tse-KgX9opb8-M2bD8POZzoKw6M9yuZLxBNbuWPBQyW5xA5m_8v4Q_Qda2lKeICXcAQsScD-X6Xr7A6XAyK6pSGsBDmgc6JW67z0YvNxtE8c28ayJzmJWCe35FY86OethCiTDOvNGBPnc',
        category: 'Dairy Essentials',
        isBestValue: true,
        frequency: 'Daily',
        products: [
            { id: 101, name: 'Fresh Cow Milk', quantity: 1, unit: 'L', price: 30, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=200&q=80' }
        ]
    },
    {
        id: 'daily_2',
        title: 'Pure Buffalo Milk',
        description: 'Thick, creamy, and high-protein milk for families.',
        price: 42.00,
        unit: 'Daily',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8VG-ZPpgMcSiW7wgKlpcy4Oa_pudGJL7bQeyZzXJmGummLkfwyfaryPruV5WvJ34Pm5SGDAFYrq1wdDdZkMxBi1pJm2XCfI_FmzpBya1k_7e1WD_4l7Y2ulQ0cWD8zbe8oX173gt2Vv6_NZe0k_c42hoQwaLfxzF52hOzOePcj3DxKlAwdr8r0NLK90yvHzHIVZo50a48QPsbq1B68fHWvcocVHxeGSK0jXMh3P1KSkPMqWCI6Ih71hmlmUNmO4QujgaeyEM5DXpL',
        category: 'Dairy Essentials',
        frequency: 'Daily',
        products: [
            { id: 102, name: 'Pure Buffalo Milk', quantity: 1, unit: 'L', price: 42, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' }
        ]
    },
    {
        id: 'daily_3',
        title: 'A2 Desi Cow Milk',
        description: 'Easy to digest organic A2 protein milk from local farms.',
        price: 49.50,
        originalPrice: 55.00,
        unit: 'Daily',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALN5zgfxibPTubNp04uOdwwDWp9CH4WzeBYjidebD3to-1dDVlL-CuWSb3qozWZB86kgbmGLKEay9wu9EuWlBAlXu46NVJd32z3Kl2mpddBc8R1dJhkKxcRCB8OirSF2KwucTMIWD0dT-yoP_WorSE3Ai7W3T2XzEzm8qLu8IkJz3k37HS6fh6AK4qoQ7PUqxE2BZa3mTOrWCpFGKwWGIZXR8XgAcO53XRjOoPqu4NO-8jV56K58OGHvHm484PNZr502DKzjc_2sSw',
        category: 'Organic Selection',
        discount: '10% Off',
        frequency: 'Daily',
        products: [
            { id: 103, name: 'A2 Desi Cow Milk', quantity: 1, unit: 'L', price: 110, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80' },
            { id: 104, name: 'Probiotic Curd', quantity: 1, unit: '500g', price: 45, image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=200&q=80' },
            { id: 105, name: 'Farm Fresh Brown Eggs', quantity: 6, unit: 'pcs', price: 90, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=200&q=80' }
        ]
    },
    // --- WEEKLY PLANS ---
    {
        id: 'weekly_1',
        title: 'Weekly Family Pack',
        description: '7 Liters of fresh cow milk delivered once a week.',
        price: 200.00,
        unit: 'Per Week',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Family Packs',
        isBestValue: true,
        frequency: 'Weekly',
        products: [
            { id: 101, name: 'Fresh Cow Milk', quantity: 7, unit: 'L', price: 455, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=200&q=80' },
            { id: 106, name: 'Farmstead Butter', quantity: 1, unit: '250g', price: 210, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=200&q=80' },
            { id: 107, name: 'Pure Desi Ghee', quantity: 1, unit: '500ml', price: 650, image: 'https://images.unsplash.com/photo-1615485737651-0e87d99f3c4f?auto=format&fit=crop&w=200&q=80' }
        ]
    },
    {
        id: 'weekly_2',
        title: 'Organic Weekender',
        description: 'Assorted organic dairy products for the weekend.',
        price: 350.00,
        unit: 'Per Week',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&h=600&q=80',
        category: 'Organic Selection',
        frequency: 'Weekly',
        products: [
            { id: 103, name: 'A2 Desi Cow Milk', quantity: 2, unit: 'L', price: 220, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80' },
            { id: 104, name: 'Probiotic Curd', quantity: 2, unit: 'Pack', price: 90, image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=200&q=80' },
            { id: 108, name: 'Greek Yogurt (Berry)', quantity: 1, unit: '120g', price: 60, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=200&q=80' }
        ]
    }
];