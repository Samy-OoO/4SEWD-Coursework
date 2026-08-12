function getSetValues(){
    

    const newId = allSuppliersList.length>0
    ? Math.max(...allSuppliersList.map(s => s.id)) +1 : 1;

    const name = document.getElementById("sup-name").value;
    const desc = document.getElementById("supplier-desc");
    const email = document.getElementById("sup-email").value;
    const phone = Number(document.getElementById("sup-phone").value);
    
    const newSupplier = {
        id: newId,
        name: name,
        desc: desc,
        email: email,
        phone: phone
    }

    allSuppliersList.push(newSupplier);
    console.log(allSuppliersList);
    localStorage.setItem("suppliers", JSON.stringify(allSuppliersList));
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("supplier-form");
    form.addEventListener('submit', function(event){
        event.preventDefault();
        getSetValues();
    })
})