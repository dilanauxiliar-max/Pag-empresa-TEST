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

    const solicitud = {

        cliente: {
            nombre:
                document.getElementById('clienteNombre').value,

            email:
                document.getElementById('clienteEmail').value,

            telefono:
                document.getElementById('clienteTelefono').value,

            empresa:
                document.getElementById('empresa').value
        },

        pedido: pedidos,

        fechaEnvio:
            new Date().toISOString()
    };

    console.log(solicitud);

    localStorage.setItem(
        'ultimaSolicitud',
        JSON.stringify(solicitud)
    );

    alert(
        'Su solicitud ha sido registrada correctamente.'
    );

    window.location.href =
        '/enviar-pedido.html';
}

window.onload = () => {

    const guardado =
        localStorage.getItem('pedidoCotizacion');

    if (guardado) {

        pedidos = JSON.parse(guardado);

        mostrarPedidos();
    }
};
