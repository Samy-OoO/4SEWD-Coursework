function showProductDetails(){

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    const prod = allProductsList.find(p => p.id === id);
    
    document.querySelector(".product-image").src = prod.image;
    document.getElementById("prod-name").innerHTML = prod.name;
    document.getElementById("prod-desc").innerHTML = "<strong>Description: </strong>" + `${prod.desc}`;
    document.getElementById("prod-price").innerHTML = "<strong>Price: </strong>" + `${prod.price}`;
    document.getElementById("prod-qty").innerHTML = "<strong>Quantity: </strong>" + prod.quantity;
    document.getElementById("prod-supplier").innerHTML = "<strong>Supplier: </strong>" + prod.supplier;
}

document.addEventListener('DOMContentLoaded',() => {
    showProductDetails();
});