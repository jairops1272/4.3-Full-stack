// Versión SIMPLE - Sin módulos
console.log('🚀 App Simple cargada');

// Configuración
const API_URL = 'https://contactos-app.jairopineda.io';

// Función para cargar contactos
async function cargarContactos() {
  console.log('🟢 Cargando contactos...');
  
  const tbody = document.getElementById('tbl-body');
  const statCount = document.getElementById('stat-count');
  
  if (!tbody) {
    console.error('❌ No se encuentra el elemento tbl-body');
    return;
  }
  
  tbody.innerHTML = '<tr><td colspan="4"><div class="text-center p-4">Cargando contactos...</div></td></tr>';
  
  try {
    const response = await fetch(`${API_URL}/contactos`);
    const data = await response.json();
    console.log('Respuesta:', data);
    
    if (data.success && data.data && data.data.length > 0) {
      let html = '';
      for (const c of data.data) {
        html += `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <div class="avatar-circle me-2" style="width:40px;height:40px;background:#0d6efd;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center">
                  ${(c.nombre?.charAt(0) || '?')}${(c.apellido?.charAt(0) || '')}
                </div>
                <div>
                  <strong>${c.nombre || ''} ${c.apellido || ''}</strong>
                </div>
              </div>
            </td>
            <td>${c.email || ''}</td>
            <td>${c.telefono || ''}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" onclick="editarContacto(${c.id})">✏️</button>
              <button class="btn btn-sm btn-outline-danger" onclick="eliminarContacto(${c.id})">🗑️</button>
            </td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
      if (statCount) statCount.textContent = data.data.length;
      console.log('✅ Tabla actualizada con', data.data.length, 'contactos');
    } else {
      tbody.innerHTML = '<tr><td colspan="4"><div class="text-center p-4">No hay contactos</div></td></tr>';
    }
  } catch (error) {
    console.error('❌ Error:', error);
    tbody.innerHTML = `<tr><td colspan="4"><div class="text-center p-4 text-danger">Error: ${error.message}</div></td></tr>`;
  }
}

// Editar contacto
window.editarContacto = async (id) => {
  console.log('Editar:', id);
  try {
    const response = await fetch(`${API_URL}/contactos/${id}`);
    const data = await response.json();
    if (data.success && data.data) {
      alert(`Editar: ${data.data.nombre} ${data.data.apellido}\nEmail: ${data.data.email}\nTeléfono: ${data.data.telefono}`);
    }
  } catch (error) {
    alert('Error al cargar el contacto');
  }
};

// Eliminar contacto
window.eliminarContacto = async (id) => {
  if (confirm('¿Estás seguro de eliminar este contacto?')) {
    try {
      const response = await fetch(`${API_URL}/contactos/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        alert('Contacto eliminado');
        cargarContactos();
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 DOM listo');
  cargarContactos();
  
  // Botón recargar
  const btnReload = document.getElementById('btn-reload');
  if (btnReload) btnReload.addEventListener('click', cargarContactos);
  
  // Búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tbl-body tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  }
});
