const defaultProducts = [
    {
        id: 1,
        image: "/images/laptop.webp",
        alt: "Laptop",
        name: "Laptop",
        desc: "Laptop is a laptop",
        price: 1000,
        quantity: 20,
        supplier: "Tech Grove"
    },
    {
        id: 2,
        image: "/images/headphones.webp",
        alt: "Headphones",
        name: "Headphones",
        desc: "",
        price: 50,
        quantity: 15,
        supplier: "Tech Grove"
    },
    {
        id: 3,
        image: "/images/tennis.jfif",
        alt: "Tennis Racket",
        name: "Tennis Racket",
        desc: "",
        price: 29.99,
        quantity: 4,
        supplier: "Elite Sports Suppliers"
    },
    {
        id: 4,
        image: "/images/ball.webp",
        alt: "Tennis Ball",
        name: "Tennis Ball",
        desc: "",
        price: 5,
        quantity: 30,
        supplier: "Elite Sports Suppliers"
    },
    {
        id: 5,
        image: "/images/cable.jpg",
        alt: "Cable",
        name: "Cable",
        desc: "",
        price: 3,
        quantity: 15,
        supplier: "Tech Grove"
    }
];


const defaultSuppliersList = [
    {
        id: 1,
        name: "Tech Grove",
        desc: "Supplies gadgets",
        email: "tech.grove@gmail.com",
        phone: 9800000000
    },
    {
        id: 2,
        name: "Elite Sports Suppliers",
        desc: "Supplies sports items",
        email: "el.sports@gmail.com",
        phone: 9811111111
    },
    {
        id: 3,
        name: "Virtuoso Music Co.",
        desc: "Supplies musical instruments",
        email: "virtuoso.music.co@gmail.com",
        phone: 9822222222
    }
];




let allProductsList = JSON.parse(localStorage.getItem("products")) || defaultProducts;
console.log(allProductsList);
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(defaultProducts));
}

let allSuppliersList = JSON.parse(localStorage.getItem("suppliers")) || defaultSuppliersList;
console.log(allSuppliersList);
if (!localStorage.getItem("suppliers")) {
    localStorage.setItem("suppliers", JSON.stringify(defaultSuppliers));
}