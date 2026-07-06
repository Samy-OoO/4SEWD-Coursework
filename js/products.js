function createMainHTMLMarkup(prod){
    const rowClass = prod.quantity <=5 ? "low-stock": ""
    
    return`
    <tr class="${rowClass}">
        <td><a href="viewProduct.htm?id=${prod.id}">
                <img src="${prod.image}" class="product-image" alt="${prod.alt}">
            </a>
        </td>
        <td>${prod.name}</td>
        <td><span class="price-badge">$${prod.price}</span></td>
        <td><span class="stock-badge">${prod.quantity}</span></td>
        <td>${prod.supplier}</td>
    </tr>
    `;
}


function renderProducts(){
    let prodListHTML = "";
    for (let prod of allProductsList){
        // Call a function to create html for each task n append it to taskListHTML
        prodListHTML += createMainHTMLMarkup(prod);
    }

    const prodListDisplay = document.querySelector(".product-table-body");
    prodListDisplay.innerHTML = prodListHTML;
}


function renderSuppliers(){
    let supListHTML = "<option>All Suppliers</option>"
    
    for(let sup of allSuppliersList){
        supListHTML += `<option>${sup.name}</option>`
    }

    const supListDisplay = document.querySelector(".select-bar");
    supListDisplay.innerHTML = supListHTML;
}


document.addEventListener('DOMContentLoaded', () =>{
    renderProducts();
    renderSuppliers();
})