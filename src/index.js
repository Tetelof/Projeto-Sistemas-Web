const product_list = document.querySelector("#product_list")
const modal = document.querySelector("#add_modal")
const show_modal = document.querySelector("#show_modal")
const modal_content = document.querySelector('#modal_content')


show_modal.addEventListener('click', (event) => {
    modal.style.display = 'block'
    addProduct()
})
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        modal_content.removeChild(modal_content.lastChild)
    }
}


function getProducts() {
    while(product_list.children.length > 0){
        product_list.removeChild(product_list.lastChild)
    }
    const url = "https://han4qcc9z1.execute-api.us-east-1.amazonaws.com/prod/produtos"
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        data.produtos.Items.forEach((item) => {
            var product_name = document.createElement('p')
            product_name.innerText = item.nome
            product_name.className = "product-name"
            var product_colour = document.createElement('p')
            product_colour.innerText = "Cor: " + item.cor
            var product_value = document.createElement('p')
            product_value.innerText = "R$ " + item.valor
            product_value.className = "product-value"
            var product_id = document.createElement('p')
            product_id.innerText = item['produto-id']
            product_id.className = "product-id"
            var product = document.createElement('div')
            product.className = "product"
            product.appendChild(product_name)
            product.appendChild(product_colour)
            product.appendChild(product_value)
            product.appendChild(product_id)
            product.addEventListener("click", ()=>{
                modal.style.display = 'block'
                editProduct(item)
            })
            product_list.appendChild(product)
        })

    }).catch(function (e) {
        console.error(e);
    });
}
getProducts()

function addProduct(){

    var div = document.createElement('div')
    div.innerHTML =
        `<h1 id="title">Adicionar Produto</h1>
        <label for="name">Nome:</label><br>
        <input type="text" id="name" name="name" placeholder="Nome do produto"><br>
        <label for="colour">Cor:</label><br>
        <input type="text" id="colour" name="colour" placeholder="Cor do produto"><br>
        <label for="value">Preço:</label><br>
        <input type="text" id="value" name="value" placeholder="R$199,99"><br><br>
        <button id="form">Adicionar</input>`
    modal_content.appendChild(div)

    form.addEventListener('click',()=>{
        postProducts(
            document.querySelector('#name').value, 
            document.querySelector('#colour').value,
            document.querySelector('#value').value
        )
        modal.style.display = 'none'
    })
}

function editProduct(item){
    var div = document.createElement('div')
    div.innerHTML =
        `<h1 id="title">Editar ${item.nome}</h1>

        <label for="name">Nome:</label><br>
        <input type="text" id="name" name="name" placeholder="Nome do produto" value="${item.nome}">
        <br>

        <label for="colour">Cor:</label><br>
        <input type="text" id="colour" name="colour" placeholder="Cor do produto" value="${item.cor}">
        <br>

        <label for="value">Preço:</label><br>
        <input type="text" id="value" name="value" placeholder="R$199,99" value="${item.valor}">
        <br><br>

        <button id="edit">Editar</button>`
        
        var delete_button = document.createElement('button')
        delete_button.innerText = 'Deletar produto'
        delete_button.addEventListener('click',()=>{
            deleteProduct(item['produto-id'])
        })
    div.appendChild(delete_button)
    modal_content.appendChild(div)

    var edit = document.querySelector('#edit')
    edit.addEventListener('click', ()=>{
        var name = document.querySelector('#name').value
        var colour = document.querySelector('#colour').value
        var value = document.querySelector('#value').value
        putProduct(name, colour, value, item['produto-id'])
    })
    
}

function postProducts(name, colour, value) {
    var body = JSON.stringify({
        "valor": value,
        "nome": name,
        "cor": colour
    })
    fetch("https://han4qcc9z1.execute-api.us-east-1.amazonaws.com/prod/produto", {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Host': "localhost",
            'Content-Length': body.length.toString()
        },
        body: body
    })
    .then(res => res.json())
    .then(res => {getProducts()});
}

function putProduct(name, colour, value, product_id){
    var body = JSON.stringify({
        "nome": name,
        "cor": colour,
        "valor": value,
        "produto-id":product_id
    })
    fetch("https://han4qcc9z1.execute-api.us-east-1.amazonaws.com/prod/produto", {
        method: 'PUT',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Host': "localhost",
            'Content-Length': body.length.toString()
        },
        body: body
    })
    .then(res => res.json())
    .then(() => {getProducts()});
}

function deleteProduct(product_id){
    var body = JSON.stringify({
        "produto-id":product_id
    })
    fetch("https://han4qcc9z1.execute-api.us-east-1.amazonaws.com/prod/produto", {
        method: 'DELETE',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Host': "localhost",
            'Content-Length': body.length.toString()
        },
        body: body
    })
    .then(res => res.json())
    .then(() => {getProducts()});
}