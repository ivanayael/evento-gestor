// Función para subir el archivo Excel y procesar los datos
function uploadFile() {
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('excelFile', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#eventTable tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla

        data.forEach(evento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${evento.Nombre}</td>
                <td>${evento.Pases}</td>
                <td>${evento.Frase}</td>
                <td><input type="text" placeholder="Añadir enlace de Google Site"/></td>
                <td><button class="btn-link">Generar Links</button></td>
                <td><button class="btn-copy">Copiar</button></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Función para exportar la tabla a Excel
function exportList() {
    const rows = document.querySelectorAll('#eventTable tbody tr');
    const data = [];

    rows.forEach(row => {
        const nombre = row.children[0].textContent;
        const pases = row.children[1].textContent;
        const frase = row.children[2].textContent;
        data.push({ Nombre: nombre, Pases: pases, Frase: frase });
    });

    fetch('/export', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'eventos.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error:', error));
}
