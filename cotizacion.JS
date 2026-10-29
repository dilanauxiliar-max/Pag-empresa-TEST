let pedidos = [];

function agregarItem() {

    const item = {

        producto:
            document.getElementById('producto').value,

        descripcion:
            document.getElementById('descripcion').value,

        cantidad:
            document.getElementById('cantidad').value,

        unidad:
            document.getElementById('unidad').value,

        marca:
            document.getElementById('marca').value,

        fecha:
            document.getElementById('fecha').value,

        archivo:
            document.getElementById('archivo').files[0]
                ? document.getElementById('archivo').files[0].name
                : '',

        comentarios:
            document.getElementById('comentarios').value
    };

    pedidos.push(item);

    localStorage.setItem(
        'pedidoCotizacion',
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    document.querySelectorAll(
        '.item-form input, .item-form textarea'
    ).forEach(campo => {

        if (campo.type !== 'file') {
            campo.value = '';
        } else {
            campo.value = null;
        }

    });
}

function mostrarPedidos() {

    const lista =
        document.getElementById('listaPedidos');

    lista.innerHTML = '';

    pedidos.forEach((item, index) => {

        lista.innerHTML += `
            <div class="item-card">

                <h4>${item.producto}</h4>

                <p><strong>Descripción:</strong>
                    ${item.descripcion}</p>

                <p><strong>Cantidad:</strong>
                    ${item.cantidad}
                    ${item.unidad}</p>

                <p><strong>Marca:</strong>
                    ${item.marca}</p>

                <p><strong>Fecha requerida:</strong>
                    ${item.fecha}</p>

                <p><strong>Archivo:</strong>
                    ${item.archivo}</p>

                <button onclick="eliminarItem(${index})">
                    Eliminar
                </button>

            </div>
        `;
    });

}

function eliminarItem(index) {

    pedidos.splice(index, 1);

    localStorage.setItem(
        'pedidoCotizacion',
        JSON.stringify(pedidos)
    );

    mostrarPedidos();
}

function guardarPedido() {

    const nombre =
        document.getElementById('clienteNombre').value;

    const email =
        document.getElementById('clienteEmail').value;

    const telefono =
        document.getElementById('clienteTelefono').value;

    const empresa =
        document.getElementById('empresa').value;

   fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            access_key: "b4a12725-a66b-4f65-9e08-369656c31ed4",
            name: nombre,
            email: email,
            telefono: telefono,
            empresa: empresa,
            message: JSON.stringify(pedidos, null, 2)
        })
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);

        if (data.success) {

            alert("Solicitud enviada correctamente");

            pedidos = [];

            localStorage.removeItem(
                "pedidoCotizacion"
            );

            mostrarPedidos();
        }

    })
    .catch(error => {

        console.error(error);

        alert("Error enviando la solicitud");
    });
}
alert("Solicitud enviada correctamente"
