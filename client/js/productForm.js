function getSetValues(){
    const newId = allProductsList.length > 0
    ? Math.max(...allProductsList.map(p => p.id)) + 1 : 1;

    const name = document.getElementById("product-name").value;
    const desc = document.getElementById("product-desc").value;
    const price = Number(document.getElementById("product-price").value);
    const quantity = Number(document.getElementById("product-qty").value);
    const supplier = document.getElementById("product-supplier").value;
    const file = document.getElementById("product-image").files[0];
    const imagePath = "/images/" + file.name;
    const alt = name;

    const newProduct = {
        id: newId,
        name: name,
        desc: desc,
        price: price,
        quantity: quantity,
        supplier: supplier,
        image: imagePath,
        alt: alt
    }
    
    allProductsList.push(newProduct);
    localStorage.setItem("products", JSON.stringify(allProductsList));
}
function renderSuppliers(){
    let allSuppliersList = JSON.parse(localStorage.getItem("suppliers"));
    let supListHTML = "";
    
    for(let sup of allSuppliersList){
        supListHTML += `<option>${sup.name}</option>`;
    }

    const supListDisplay = document.querySelector(".select-bar");
    supListDisplay.innerHTML = supListHTML;
}


document.addEventListener("DOMContentLoaded", () => {
    renderSuppliers();
    const form = document.getElementById("product-form");

    form.addEventListener("submit", function(event){
        event.preventDefault();
        getSetValues();
    });
});
