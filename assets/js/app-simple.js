// app-simple.js - Versión final
console.log('🚀 app-simple.js cargado - Versión Final');

const API_URL = 'https://contactos-app.jairopineda.io';

async function cargarContactos() {
  console.log('Cargando contactos...');
  const tbody = document.getElementById('tbl-body');
  
  try {
    const response = await fetch(`${API_URL}/contactos`);
    const data = await response.json();
    console.log('Respuesta:', data);
    
    if (data.success && data.data) {
      let html = '';
      for (const c of data.data) {
        html += `
          <tr>
            <td><strong>${c.nombre} ${c.apellido}</strong></td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick='editarContacto(${c.id})'>✏️</button>
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
    tbody.innerHTML = `<td><td colspan="4">Error: ${error.message}</td><tr>`;
  }
}

window.editarContacto = async (id) => {
  // Obtener datos actuales
  const res = await fetch(`${API_URL}/contactos/${id}`);
  const data = await res.json();
  if (data.success) {
    const c = data.data;
    const nombre = prompt('Nombre:', c.nombre);
    const apellido = prompt('Apellido:', c.apellido);
    const email = prompt('Email:', c.email);
    const telefono = prompt('Teléfono:', c.telefono);
    
    if (nombre && apellido && email && telefono) {
      const response = await fetch(`${API_URL}/contactos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, telefono })
      });
      const result = await response.json();
      if (result.success) {
        alert('Actualizado');
        cargarContactos();
      }
    }
  }
};

window.eliminarContacto = async (id) => {
  if (confirm('¿Eliminar?')) {
    const response = await fetch(`${API_URL}/contactos/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (result.success) {
      alert('Eliminado');
      cargarContactos();
    }
  }
};

// Nuevo contacto
document.getElementById('btn-new')?.addEventListener('click', async () => {
  const nombre = prompt('Nombre:');
  const apellido = prompt('Apellido:');
  const email = prompt('Email:');
  const telefono = prompt('Teléfono:');
  if (nombre && apellido && email && telefono) {
    await fetch(`${API_URL}/contactos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, email, telefono })
    });
    cargarContactos();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  cargarContactos();
  document.getElementById('btn-reload')?.addEventListener('click', cargarContactos);
});
