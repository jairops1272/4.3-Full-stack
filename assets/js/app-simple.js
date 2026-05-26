// app-simple.js - Versión corregida
console.log('🚀 app-simple.js cargado');

const API_URL = 'https://contactos-app.jairopineda.io';

async function cargarContactos() {
  console.log('Cargando contactos...');
  const tbody = document.getElementById('tbl-body');
  
  try {
    const response = await fetch(`${API_URL}/contactos`);
    const data = await response.json();
    
    if (data.success && data.data) {
      let html = '';
      for (const c of data.data) {
        html += `
          <tr id="fila-${c.id}">
            <td>${c.nombre} ${c.apellido}</td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick='editarContacto(${JSON.stringify(c)})'>✏️</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarContacto(${c.id})">🗑️</button>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
      document.getElementById('stat-count').innerText = data.data.length;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Editar usando api.php
window.editarContacto = async (contacto) => {
  const nuevoNombre = prompt('Nuevo nombre:', contacto.nombre);
  if (nuevoNombre) {
    contacto.nombre = nuevoNombre;
    try {
      const response = await fetch(`${API_URL}/api.php?path=${contacto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacto)
      });
      const result = await response.json();
      if (result.success) {
        cargarContactos();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  }
};

// Eliminar usando api.php
window.eliminarContacto = async (id) => {
  if (confirm('¿Eliminar este contacto?')) {
    try {
      const response = await fetch(`${API_URL}/api.php?path=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        cargarContactos();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarContactos();
  document.getElementById('btn-reload')?.addEventListener('click', cargarContactos);
});
