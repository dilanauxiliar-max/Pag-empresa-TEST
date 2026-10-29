let pedidos = [];

// Recuperar pedidos guardados cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    const pedidosGuardados = localStorage.getItem("pedidoCotizacion");

    if (pedidosGuardados) {
        try {
            pedidos = JSON.parse(pedidosGuardados);
        } catch (error) {
            console.error("No fue posible recuperar los pedidos:", error);
            pedidos = [];
        }
    }

    mostrarPedidos();
});

function agregarItem() {
    const producto = document.getElementById("producto").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const cantidad = document.getElementById("cantidad").value;
    const unidad = document.getElementById("unidad").value;
    const marca = document.getElementById("marca").value.trim();
    const fecha = document.getElementById("fecha").value;
    const archivoInput = document.getElementById("archivo");
    const comentarios = document.getElementById("comentarios").value.trim();

    if (!producto || !cantidad) {
        alert("Escribe como mínimo el producto y la cantidad.");
        return;
    }

    const item = {
        producto: producto,
        descripcion: descripcion,
        cantidad: cantidad,
        unidad: unidad,
        marca: marca,
        fecha: fecha,
        archivo: archivoInput.files[0]
            ? archivoInput.files[0].name
            : "",
        comentarios: comentarios
    };

    pedidos.push(item);

    localStorage.setItem(
        "pedidoCotizacion",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();

    document.querySelectorAll(
        ".item-form input, .item-form textarea, .item-form select"
    ).forEach(campo => {
        if (campo.type === "file") {
            campo.value = "";
        } else {
            campo.value = "";
        }
    });
}

function mostrarPedidos() {
    const lista = document.getElementById("listaPedidos");

    if (!lista) {
        console.error("No existe un elemento con id='listaPedidos'.");
        return;
    }

    lista.innerHTML = "";

    pedidos.forEach((item, index) => {
        lista.innerHTML += `
            <div class="item-card">
                <h4>${item.producto}</h4>

                <p>
                    <strong>Descripción:</strong>
                    ${item.descripcion || "Sin descripción"}
                </p>

                <p>
                    <strong>Cantidad:</strong>
                    ${item.cantidad} ${item.unidad}
                </p>

                <p>
                    <strong>Marca:</strong>
                    ${item.marca || "Sin marca específica"}
                </p>

                <p>
                    <strong>Fecha requerida:</strong>
                    ${item.fecha || "Sin fecha"}
                </p>

                <p>
                    <strong>Archivo:</strong>
                    ${item.archivo || "Sin archivo"}
                </p>

                <p>
                    <strong>Comentarios:</strong>
                    ${item.comentarios || "Sin comentarios"}
                </p>

                <button
                    type="button"
                    onclick="eliminarItem(${index})"
                >
                    Eliminar
                </button>
            </div>
        `;
    });
}

function eliminarItem(index) {
    pedidos.splice(index, 1);

    localStorage.setItem(
        "pedidoCotizacion",
        JSON.stringify(pedidos)
    );

    mostrarPedidos();
}

async function guardarPedido() {
    const nombre = document
        .getElementById("clienteNombre")
        .value
        .trim();

    const email = document
        .getElementById("clienteEmail")
        .value
        .trim();

    const telefono = document
        .getElementById("clienteTelefono")
        .value
        .trim();

    const empresa = document
        .getElementById("empresa")
        .value
        .trim();

    if (!nombre || !email) {
        alert("Escribe tu nombre y correo electrónico.");
        return;
    }

    if (pedidos.length === 0) {
        alert("Primero debes agregar al menos un producto.");
        return;
    }

    const botonEnviar = document.getElementById("botonEnviar");

    if (botonEnviar) {
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
    }

   const mensajePedido = pedidos.map((item, index) => {
return `
PRODUCTO ${index + 1}
 
Producto: ${item.producto}
Descripción: ${item.descripcion || "No especificada"}
Cantidad: ${item.cantidad} ${item.unidad}
Marca: ${item.marca || "No especificada"}
Fecha requerida: ${item.fecha || "No especificada"}
Archivo: ${item.archivo || "No adjuntado"}
Comentarios: ${item.comentarios || "Sin comentarios"}
`.trim();
}).join("\n\n--------------------------------\n\n");

    try {
        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "b4a12725-a66b-4f65-9e08-369656c31ed4",
                    subject: `Nueva solicitud de cotización de ${nombre}`,
                    from_name: "Formulario de Cotizaciones",
                    name: nombre,
                    email: email,
                    telefono: telefono,
                    empresa: empresa,
                    message: mensajePedido
                })
            }
        );

        const data = await response.json();

        console.log("Respuesta de Web3Forms:", data);

        if (data.success) {
            alert("Solicitud enviada correctamente.");

            pedidos = [];

            localStorage.removeItem("pedidoCotizacion");

            mostrarPedidos();

            document.getElementById("clienteNombre").value = "";
            document.getElementById("clienteEmail").value = "";
            document.getElementById("clienteTelefono").value = "";
            document.getElementById("empresa").value = "";
        } else {
            console.error("Error de Web3Forms:", data);

            alert(
                data.message ||
                "Web3Forms rechazó la solicitud. Revisa la consola."
            );
        }
    } catch (error) {
        console.error("Error enviando la solicitud:", error);

        alert(
            "No fue posible enviar la solicitud. Revisa tu conexión y la consola."
        );
    } finally {
        if (botonEnviar) {
            botonEnviar.disabled = false;
            botonEnviar.textContent = "Enviar solicitud";
        }
    }
}
