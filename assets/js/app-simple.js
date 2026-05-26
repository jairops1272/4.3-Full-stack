// app-simple.js - Adaptado para la API de tu amigo
console.log('🚀 app-simple.js cargado');

const API_URL = 'https://contactos-app.jairopineda.io';

async function cargarContactos() {
  console.log('Cargando contactos...');
  const tbody = document.getElementById('tbl-body');
  
  if (!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="4"><div class="text-center p-4">Cargando...</div></td></tr>';
  
  try {
    // GET con action=contactos
    const response = await fetch(`${API_URL}/?action=contactos`);
    const data = await response.json();
    console.log('Respuesta:', data);
    
    if (data.success && data.data && data.data.length > 0) {
      let html = '';
      for (const c of data.data) {
        html += `
          <tr id="fila-${c.id_contacto}">
            <td>
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-2" style="width:40px;height:40px;background:#0d6efd;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center">
                  ${(c.nombre?.charAt(0) || '?')}${(c.apellido?.charAt(0) || '')}
                </div>
                <div>
                  <strong>${c.nombre || ''} ${c.apellido || ''}</strong><br>
                  <small class="text-muted">${c.nombre_categoria || 'Sin categoría'}</small>
                </div>
              </div>
             </div>
            <td>${c.email_principal || '—'}</div>
            <td>${c.telefono_principal || '—'}</div>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" onclick='editarContacto(${c.id_contacto})'>✏️</button>
              <button class="btn btn-sm btn-outline-danger" onclick="eliminarContacto(${c.id_contacto})">🗑️</button>
             </div>
           </tr>
        `;
      }
      tbody.innerHTML = html;
      document.getElementById('stat-count').innerText = data.data.length;
      console.log('✅ Tabla actualizada con', data.data.length, 'contactos');
    } else {
      tbody.innerHTML = '<tr><td colspan="4"><div class="text-center p-4">No hay contactos</div></td></tr>';
    }
  } catch (error) {
    console.error('Error al cargar:', error);
    tbody.innerHTML = `<tr><td colspan="4"><div class="text-center p-4 text-danger">Error: ${error.message}</div></td></tr>`;
  }
}

// Agregar contacto
window.agregarContacto = async () => {
  const nombre = prompt('Nombre:');
  const apellido = prompt('Apellido:');
  const email = prompt('Email:');
  const telefono = prompt('Teléfono:');
  const categoria = prompt('ID de categoría (1-3):', '1');
  
  if (nombre && apellido && email && telefono) {
    try {
      const response = await fetch(`${API_URL}/?action=agregar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          correo: email,
          telefono: telefono,
          id_categoria: parseInt(categoria) || 1,
          fecha_nacimiento: null
        })
      });
      const result = await response.json();
      if (result.success) {
        alert('Contacto agregado');
        cargarContactos();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  }
};

// Editar contacto
window.editarContacto = async (id) => {
  // Primero obtener los datos actuales
  const res = await fetch(`${API_URL}/?action=contactos`);
  const data = await res.json();
  const contacto = data.data.find(c => c.id_contacto === id);
  
  if (contacto) {
    const nombre = prompt('Nuevo nombre:', contacto.nombre);
    const apellido = prompt('Nuevo apellido:', contacto.apellido);
    const email = prompt('Nuevo email:', contacto.email_principal);
    const telefono = prompt('Nuevo teléfono:', contacto.telefono_principal);
    
    if (nombre && apellido) {
      try {
        const response = await fetch(`${API_URL}/?action=actualizar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_contacto: id,
            nombre: nombre,
            apellido: apellido,
            correo: email,
            telefono: telefono,
            id_categoria: contacto.id_categoria || 1
          })
        });
        const result = await response.json();
        if (result.success) {
          alert('Contacto actualizado');
          cargarContactos();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }
  }
};

// Eliminar contacto
window.eliminarContacto = async (id) => {
  if (confirm('¿Estás seguro de eliminar este contacto?')) {
    try {
      const response = await fetch(`${API_URL}/?action=eliminar&id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        alert('Contacto eliminado');
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
  console.log('DOM listo');
  cargarContactos();
  
  // Botón recargar
  document.getElementById('btn-reload')?.addEventListener('click', cargarContactos);
  
  // Botón nuevo contacto
  const btnNew = document.querySelector('[data-action="new"]');
  if (btnNew) {
    btnNew.addEventListener('click', agregarContacto);
  }
});
