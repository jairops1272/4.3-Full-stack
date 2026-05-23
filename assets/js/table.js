/**
 * assets/js/table.js
 * Módulo de renderizado y gestión de la tabla de contactos
 */

const PALETTES = [
  ['#0f2a4a','#00d4ff'], ['#1e1040','#7c6ff7'], ['#0a2e1e','#00e5a0'],
  ['#2e100d','#ff7b86'], ['#2a1f00','#ffb830'], ['#081e2e','#56c8e8'],
  ['#20103a','#a78bfa'], ['#0a2420','#34d399'],
];

export class ContactsTable {
  #tbody;
  #countEl;
  #footInfoEl;
  #data    = [];
  #query   = '';
  #sortKey = 'id';
  #sortAsc = true;

  /** Callbacks */
  onEdit   = () => {};
  onDelete = () => {};

  constructor() {
    this.#tbody      = document.getElementById('tbl-body');
    this.#countEl    = document.getElementById('stat-count');
    this.#footInfoEl = document.getElementById('foot-info');
    console.log('🟢 ContactsTable constructor - tbody encontrado:', !!this.#tbody);
  }

  /** Carga datos y renderiza */
  load(rows) {
    console.log('🟢 table.load() recibido:', rows);
    console.log('🟢 ¿Es array?', Array.isArray(rows));
    console.log('🟢 rows?.data?', rows?.data);
    
    this.#data = Array.isArray(rows) ? rows : (rows?.data ?? []);
    console.log('🟢 Datos procesados, cantidad:', this.#data.length);
    
    this.render();
    if (this.#countEl) this.#countEl.textContent = this.#data.length;
  }

  /** Actualiza búsqueda */
  filter(q) { this.#query = q.toLowerCase().trim(); this.render(); }

  /** Cambia columna de orden */
  sort(key) {
    this.#sortAsc = this.#sortKey === key ? !this.#sortAsc : true;
    this.#sortKey = key;
    this.render();
  }

  showLoading() {
    console.log('🟢 showLoading()');
    this.#tbody.innerHTML = `<tr><td colspan="5"><div class="t-state">
      <div class="spinner-ring"></div><p class="t-state-msg">Cargando contactos…</p>
    </div></td></td>`;
  }

  showError(msg) {
    console.log('🟢 showError():', msg);
    this.#tbody.innerHTML = `<tr><td colspan="5"><div class="t-state">
      <div class="t-state-icon">⚠</div><p class="t-state-msg">${this.#esc(msg)}</p>
    </div></td></tr>`;
  }

  render() {
    console.log('🟢 render() - data.length:', this.#data.length);
    const filtered = this.#applyFilter();
    const sorted   = this.#applySort(filtered);
    console.log('🟢 filtered.length:', filtered.length, 'sorted.length:', sorted.length);

    if (!sorted.length) {
      const msg = this.#query
        ? `Sin resultados para &ldquo;${this.#esc(this.#query)}&rdquo;`
        : 'No hay contactos registrados. ¡Agrega el primero!';
      this.#tbody.innerHTML = `<tr><td colspan="5"><div class="t-state">
        <div class="t-state-icon" style="color:var(--text-3)">◎</div>
        <p class="t-state-msg">${msg}</p>
      </div></td></td>`;
      this.#setFootInfo(0, this.#data.length);
      return;
    }

    console.log('🟢 Renderizando', sorted.length, 'filas');
    this.#tbody.innerHTML = sorted.map((c, i) => this.#row(c, i)).join('');
    this.#setFootInfo(sorted.length, this.#data.length);

    // Bind de botones de acción
    this.#tbody.querySelectorAll('[data-act="edit"]')
      .forEach(b => b.addEventListener('click', () => this.onEdit(+b.dataset.id)));
    this.#tbody.querySelectorAll('[data-act="del"]')
      .forEach(b => b.addEventListener('click', () => this.onDelete(+b.dataset.id)));
  }

  /** Resalta fila por id */
  highlight(id) {
    const row = this.#tbody.querySelector(`[data-rid="${id}"]`);
    if (!row) return;
    row.classList.add('row-pulse');
    row.addEventListener('animationend', () => row.classList.remove('row-pulse'), { once: true });
  }

  // ── Private ───────────────────────────────────────────────────

  #applyFilter() {
    if (!this.#query) return this.#data;
    return this.#data.filter(c =>
      [c.nombre, c.apellido, c.email, c.telefono]
        .some(v => (v ?? '').toLowerCase().includes(this.#query))
    );
  }

  #applySort(rows) {
    const k = this.#sortKey;
    return [...rows].sort((a, b) => {
      let va = a[k] ?? '', vb = b[k] ?? '';
      if (!isNaN(va) && !isNaN(vb)) { va = +va; vb = +vb; }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
      return va < vb ? (this.#sortAsc ? -1 : 1) : va > vb ? (this.#sortAsc ? 1 : -1) : 0;
    });
  }

  #row(c, i) {
    const [bg, fg] = PALETTES[i % PALETTES.length];
    const init = `${(c.nombre?.[0] ?? '?')}${(c.apellido?.[0] ?? '')}`.toUpperCase();
    const full = `${this.#esc(c.nombre ?? '')} ${this.#esc(c.apellido ?? '')}`.trim();
    return `
      <tr data-rid="${c.id}">
        <td>
          <div class="cell-contact">
            <div class="avatar" style="background:${bg};color:${fg}">${init}</div>
            <div>
              <div class="contact-name">${full}</div>
              <div class="contact-meta">#${String(c.id).padStart(4,'0')}</div>
            </div>
          </div>
        </td>
        <td class="cell-email"><a href="mailto:${this.#esc(c.email ?? '')}">${this.#esc(c.email ?? '—')}</a></td>
        <td class="cell-phone">${this.#esc(c.telefono ?? '—')}</td>
        <td>
          <div class="cell-actions">
            <button class="btn-row btn-row-edit"   data-act="edit" data-id="${c.id}" title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-row btn-row-delete" data-act="del"  data-id="${c.id}" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </td>
      </table>`;
  }

  #setFootInfo(shown, total) {
    if (!this.#footInfoEl) return;
    this.#footInfoEl.textContent = shown === total
      ? `${total} registro${total !== 1 ? 's' : ''} en total`
      : `Mostrando ${shown} de ${total} registros`;
  }

  #esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}
