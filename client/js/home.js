function renderData(){
    document.getElementById("total-products").textContent = allProductsList.length;

    document.getElementById("total-low-stock").textContent = allProductsList.filter(p => p.quantity<=5).length;

    const totalValue = allProductsList.reduce((sum,p) => sum + p.price * p.quantity, 0);
    document.getElementById("total-inventory-value").textContent = `$${totalValue.toFixed(2)}`

    document.getElementById("total-suppliers").textContent = allSuppliersList.length;
}

document.addEventListener('DOMContentLoaded', () => {
    renderData();
})