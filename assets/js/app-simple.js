// app-simple.js - Versión con api.php
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
            <td><strong>${c.nombre} ${c.apellido}</strong></td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick='editarContacto(${c.id})'>✏️ Editar</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarContacto(${c.id})">🗑️ Eliminar</button>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
      document.getElementById('stat-count').innerText = data.data.length;
      console.log('✅ Tabla actualizada');
    }
  } catch (error) {
    console.error('Error al cargar:', error);
  }
}

// Editar contacto usando api.php
window.editarContacto = async (id) => {
  // Primero obtener los datos del contacto
  const response = await fetch(`${API_URL}/contactos/${id}`);
  const data = await response.json();
  
  if (data.success && data.data) {
    const c = data.data;
    const nombre = prompt('Nuevo nombre:', c.nombre);
    const apellido = prompt('Nuevo apellido:', c.apellido);
    const email = prompt('Nuevo email:', c.email);
    const telefono = prompt('Nuevo teléfono:', c.telefono);
    
    if (nombre && apellido && email && telefono) {
      try {
        const updateResponse = await fetch(`${API_URL}/api.php?path=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, apellido, email, telefono })
        });
        const result = await updateResponse.json();
        if (result.success) {
          alert('Contacto actualizado');
          cargarContactos();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        alert('Error de conexión al actualizar');
      }
    }
  }
};

// Eliminar contacto usando api.php
window.eliminarContacto = async (id) => {
  if (confirm('¿Estás seguro de eliminar este contacto?')) {
    try {
      const deleteResponse = await fetch(`${API_URL}/api.php?path=${id}`, {
        method: 'DELETE'
      });
      const result = await deleteResponse.json();
      if (result.success) {
        alert('Contacto eliminado');
        cargarContactos();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexión al eliminar');
    }
  }
};

// Botón nuevo contacto
document.getElementById('btn-new')?.addEventListener('click', async () => {
  const nombre = prompt('Nombre:');
  const apellido = prompt('Apellido:');
  const email = prompt('Email:');
  const telefono = prompt('Teléfono:');
  
  if (nombre && apellido && email && telefono) {
    try {
      const response = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, telefono })
      });
      const result = await response.json();
      if (result.success) {
        alert('Contacto agregado');
        cargarContactos();
      }
    } catch (error) {
      alert('Error al agregar');
    }
  }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM listo');
  cargarContactos();
  document.getElementById('btn-reload')?.addEventListener('click', cargarContactos);
});
