function createHTMLMarkup(sup){
    return `
    <tr>
        <td>${sup.name}</td>
        <td>${sup.email}</td>
        <td>${sup.phone}</td>
    </tr>
    `;
}

function renderSuppliers(){
    let suppliers = "";
    for(let sup of allSuppliersList){
        suppliers += createHTMLMarkup(sup);
    }

    const supplierHTML = document.querySelector(".supplier-table-body");
    supplierHTML.innerHTML = suppliers;
}

document.addEventListener('DOMContentLoaded', () => {
    renderSuppliers();
})