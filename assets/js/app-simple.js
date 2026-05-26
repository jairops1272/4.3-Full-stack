// app-simple.js
console.log('🚀 app-simple.js cargado');

const API_URL = 'https://contactos-app.jairopineda.io';

async function cargarContactos() {
  console.log('Cargando contactos...');
  const tbody = document.getElementById('tbl-body');
  
  if (!tbody) {
    console.error('No se encontró tbody');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/contactos`);
    const data = await response.json();
    console.log('Respuesta:', data);
    
    if (data.success && data.data) {
      let html = '';
      for (const c of data.data) {
        html += `
          <tr>
            <td>${c.nombre} ${c.apellido}</td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editarContacto(${c.id})">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarContacto(${c.id})">🗑️</button>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
      document.getElementById('stat-count').innerText = data.data.length;
      console.log('✅ Tabla actualizada con', data.data.length, 'contactos');
    }
  } catch (error) {
    console.error('Error:', error);
    tbody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td><tr>`;
  }
}

window.editarContacto = async (id) => {
  const response = await fetch(`${API_URL}/contactos/${id}`);
  const data = await response.json();
  if (data.success) {
    const c = data.data;
    const nombre = prompt('Nuevo nombre:', c.nombre);
    const apellido = prompt('Nuevo apellido:', c.apellido);
    const email = prompt('Nuevo email:', c.email);
    const telefono = prompt('Nuevo teléfono:', c.telefono);
    
    if (nombre) {
      await fetch(`${API_URL}/contactos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, telefono })
      });
      cargarContactos();
    }
  }
};

window.eliminarContacto = async (id) => {
  if (confirm('¿Eliminar este contacto?')) {
    await fetch(`${API_URL}/contactos/${id}`, { method: 'DELETE' });
    cargarContactos();
  }
};

// Iniciar
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM listo');
  cargarContactos();
  document.getElementById('btn-reload')?.addEventListener('click', cargarContactos);
});
