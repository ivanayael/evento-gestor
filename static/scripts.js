function uploadFile() {
    const fileInput = document.getElementById('uploadFile');
    var siteLink = document.getElementById('googleSite');
    const file = fileInput.files[0];
    var myLink = siteLink.value;

    if (!file) {
        alert('Por favor, selecciona un archivo de Excel.');
        return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#eventTable tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla

        data.forEach(evento => {

            const row = document.createElement('tr');
       
            var nombre = `${evento.Nombre}`; 

            var pases  = `${evento.Pases}`; 
          
            var frases  = `${evento.Frase}`; 
          
            var URLLink = encodeURI(myLink + "&n=" + nombre  + "&p=" + pases + "&f=" + frases);
 
            row.innerHTML = `
                <td>${nombre}</td>
                <td>${pases}</td>
                <td>${frases}</td>               
                <td><input type="text" value="${myLink}" placeholder="Añadir enlace de Google Site" /></td>
                <td><input type="text" value="${encodeURI(URLLink)}" placeholder="Link de Invitacion" /></td>
                <td><a href="value="${encodeURI(URLLink)}" class="btn-copy">Copiar</a></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el archivo: ' + error.message);
    });
}

function exportList() {
    const rows = document.querySelectorAll('#eventTable tbody tr:not(:first-child)');
    const data = [];

    rows.forEach(row => {
        const nombre = row.children[0].textContent;
        const pases = row.children[1].textContent;
        const frase = row.children[2].textContent;
        const linkurl = row.children[3].textContent;
        const linkinvitacion = row.children[4].textContent;
        data.push({ Nombre: nombre, Pases: pases, Frase: frase, linkurl: linkurl, linkinvitacion: linkinvitacion });
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
    .catch(error => {
        console.error('Error:', error);
        alert('Error al exportar la lista: ' + error.message);
    });
}

function clearList() {
    const tableBody = document.querySelector('#eventTable tbody');
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay datos disponibles.</td></tr>`;
}