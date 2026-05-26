// Versión definitiva - 2025
import { ApiService } from './api2.js';

console.log('🚀 App.js cargado - Versión Definitiva');

// Función principal
async function cargarContactos() {
  console.log('🟢 Cargando contactos...');
  
  const tbody = document.getElementById('tbl-body');
  const statCount = document.getElementById('stat-count');
  
  if (!tbody) {
    console.error('❌ No se encuentra el elemento tbl-body');
    return;
  }
  
  // Mostrar loading
  tbody.innerHTML = `<tr><td colspan="4"><div class="text-center p-4">Cargando contactos...</div></td></tr>`;
  
  try {
    // Llamar a la API
    const contactos = await ApiService.getAll();
    console.log('🟢 Contactos recibidos:', contactos);
    console.log('🟢 Tipo:', typeof contactos);
    console.log('🟢 ¿Es array?', Array.isArray(contactos));
    console.log('🟢 Cantidad:', contactos?.length);
    
    // Verificar que tenemos datos
    if (!contactos || !Array.isArray(contactos) || contactos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="text-center p-4">No hay contactos disponibles</div></td></tr>`;
      if (statCount) statCount.textContent = '0';
      return;
    }
    
    // Generar HTML de la tabla
    let html = '';
    for (const c of contactos) {
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
    if (statCount) statCount.textContent = contactos.length;
    console.log('✅ Tabla actualizada con', contactos.length, 'contactos');
    
  } catch (error) {
    console.error('❌ Error cargando contactos:', error);
    tbody.innerHTML = `<tr><td colspan="4"><div class="text-center p-4 text-danger">Error: ${error.message}</div></td></tr>`;
  }
}

// Funciones globales para los botones
window.editarContacto = async (id) => {
  console.log('Editar contacto:', id);
  try {
    const contacto = await ApiService.getOne(id);
    console.log('Contacto a editar:', contacto);
    alert(`Editar: ${contacto.nombre} ${contacto.apellido}`);
  } catch (error) {
    console.error('Error al editar:', error);
    alert('Error al cargar el contacto');
  }
};

window.eliminarContacto = async (id) => {
  console.log('Eliminar contacto:', id);
  if (confirm('¿Estás seguro de eliminar este contacto?')) {
    try {
      await ApiService.remove(id);
      alert('Contacto eliminado correctamente');
      cargarContactos(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el contacto');
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 DOM listo, inicializando...');
  cargarContactos();
  
  // Configurar botón de recarga
  const btnReload = document.getElementById('btn-reload');
  if (btnReload) {
    btnReload.addEventListener('click', cargarContactos);
  }
  
  // Configurar búsqueda
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
