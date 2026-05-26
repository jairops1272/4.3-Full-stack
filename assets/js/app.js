import { ApiService } from './api2.js';

console.log('🟢 App.js cargado - Versión SIMPLE');

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🟢 DOM listo, cargando contactos...');
  
  try {
    const contactos = await ApiService.getAll();
    console.log('🟢 Contactos recibidos:', contactos);
    console.log('🟢 Cantidad:', contactos?.length);
    
    const tbody = document.getElementById('tbl-body');
    if (tbody && contactos && contactos.length > 0) {
      const html = contactos.map(c => `
        <tr>
          <td>${c.nombre} ${c.apellido}</td>
          <td>${c.email}</td>
          <td>${c.telefono}</td>
          <td>
            <button class="btn-row btn-row-edit" data-id="${c.id}">✏️</button>
            <button class="btn-row btn-row-delete" data-id="${c.id}">🗑️</button>
          </td>
        </tr>
      `).join('');
      tbody.innerHTML = html;
      document.getElementById('stat-count').textContent = contactos.length;
      console.log('✅ Tabla actualizada con', contactos.length, 'contactos');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    document.getElementById('tbl-body').innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
  }
});
