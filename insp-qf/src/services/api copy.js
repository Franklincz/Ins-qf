// src/services/api.js
class ApiService {
  constructor() {
    // si el frontend y backend están en el mismo dominio, deja baseUrl = ''
    this.baseUrl = ''; // 'http://localhost:3000' si lo necesitas
    this.endpoints = {
      reports: '/api/reports',         // GET (lista, filtros, paginación), POST (crear)
      report:  '/api/reports',         // /:id para GET/PUT/DELETE si lo agregas
      clear:   '/api/reports/clear',   // POST (borrado masivo)
      estados: '/api/estados',         // opcional si lo usas
    };
  }

  // ------------------------ helper HTTP ------------------------
  async request(url, options = {}) {
    const config = {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    };

    const res = await fetch(`${this.baseUrl}${url}`, config);

    if (!res.ok) {
      // permite 204 sin contenido
      if (res.status === 204) return null;
      const text = await res.text().catch(() => '');
      const message = text || `HTTP error ${res.status}`;
      throw new Error(message);
    }

    // intenta parsear JSON sólo si hay cuerpo
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const raw = await res.text();
    try { return JSON.parse(raw); } catch { return raw; }
  }

  // ============================================================
  // ===================== REPORTES (LISTA) =====================
  // ============================================================

  /**
   * Obtiene reportes desde el backend con filtros + paginación.
   * @param {Object} opts
   * @param {'all'|'approved'|'pending'|'rejected'} opts.status
   * @param {number} opts.limit
   * @param {string|null} opts.cursor - cursor devuelto por el backend (JSON string)
   * @returns {Promise<{items: any[], nextCursor: string|null}>}
   */
  async getReportes({ status = 'all', limit = 20, cursor = null } = {}) {
    const params = new URLSearchParams({ status, limit: String(limit) });
    if (cursor) params.set('cursor', cursor);

    try {
      // Espera { items, nextCursor }
      const data = await this.request(`${this.endpoints.reports}?${params.toString()}`);
      // Garantiza forma
      return {
        items: Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []),
        nextCursor: data?.nextCursor ?? null,
      };
    } catch (error) {
      console.error('Error fetching reportes:', error);
      // Fallback local en caso de error
      const local = await this.loadFromLocalJson();
      return { items: local, nextCursor: null };
    }
  }

  /**
   * Devuelve sólo los items ya formateados para el modal
   * y preserva el nextCursor para “Cargar más”.
   */
  async getReportesForHistory({ status = 'all', limit = 20, cursor = null } = {}) {
    const { items, nextCursor } = await this.getReportes({ status, limit, cursor });
    return {
      items: this.formatReportesForHistory(items),
      nextCursor,
    };
  }

  // ============================================================
  // =================== CRUD (ID / CREATE) =====================
  // ============================================================

  // Crear nuevo reporte
  async createReporte(reporteData) {
    return this.request(this.endpoints.reports, {
      method: 'POST',
      body: JSON.stringify(reporteData),
    });
  }

  // Obtener un reporte por id (si implementas GET /api/reports/[id])
  async getReporte(id) {
    try {
      const data = await this.request(`${this.endpoints.report}/${id}`);
      return data;
    } catch (error) {
      console.warn('GET /report/:id no disponible; buscando en la lista.', error);
      // fallback: busca en la página actual de reportes
      const { items } = await this.getReportes();
      return items.find(r => r.id === id) || null;
    }
  }

  // Actualizar reporte (si implementas PUT /api/reports/[id])
  async updateReporte(id, reporteData) {
    return this.request(`${this.endpoints.report}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reporteData),
    });
  }

  // Eliminar reporte
  async deleteReporte(id) {
    return this.request(`${this.endpoints.report}/${id}`, { method: 'DELETE' });
  }

  // Vaciar todo (borrado masivo)
  async clearAllReportes() {
    return this.request(this.endpoints.clear, { method: 'POST' });
  }

  // ============================================================
  // ========================= ESTADOS ==========================
  // ============================================================

  async getEstados() {
    try {
      const data = await this.request(this.endpoints.estados);
      return data?.estados || data || {
        aprobado:  { descripcion: 'Aprobado',  color: '#28a745' },
        rechazado: { descripcion: 'Rechazado', color: '#dc3545' },
        pendiente: { descripcion: 'Pendiente', color: '#ffc107' },
      };
    } catch {
      return {
        aprobado:  { descripcion: 'Aprobado',  color: '#28a745' },
        rechazado: { descripcion: 'Rechazado', color: '#dc3545' },
        pendiente: { descripcion: 'Pendiente', color: '#ffc107' },
      };
    }
  }

  // ============================================================
  // =================== AYUDAS PARA EL MODAL ===================
  // ============================================================

  /**
   * Normaliza items de Firestore a la forma que usa tu modal.
   * Acepta documentos tanto “crudos” como los que vienen de GET /api/reports.
   */
  formatReportesForHistory(items) {
    const toDate = (v) => {
      // Firestore Timestamp
      if (v && typeof v.toDate === 'function') return v.toDate();
      // ISO / string / number
      try { return v ? new Date(v) : null; } catch { return null; }
    };

    return items.map((r) => ({
      id: r.id,
      date: toDate(r.fecha) || toDate(r?.datos_inspeccion?.fecha) || null,
      product: r.product || r?.datos_inspeccion?.producto || 'Producto no especificado',
      lot: r.lote || r?.datos_inspeccion?.lote || '',
      status: r.status || r.estado || 'pending', // si aún guardas “estado” en español
      area: r.area || r?.datos_inspeccion?.area || '',
      elaborado_por: r.elaborado_por || r?.elaboracion?.elaborado_por || '',
      total_defectos:
        typeof r.total_defectos === 'number'
          ? r.total_defectos
          : (typeof r?.defectos?.total_general === 'number' ? r.defectos.total_general : 0),
      completado: Boolean(r.completado ?? r?.metadata?.completado),
    }));
  }

  // ============================================================
  // ======================= FALLBACK LOCAL =====================
  // ============================================================

  // JSON local (para desarrollo/offline)
  async loadFromLocalJson() {
    try {
      // si pones /public/data/db.json  ->  fetch('/data/db.json')
      const res = await fetch('/data/db.json');
      const data = await res.json();
      // admite {items} o {reportes} o array directo
      const items = data.items || data.reportes || data;
      return Array.isArray(items) ? items : this.getFallbackData();
    } catch (e) {
      console.warn('No se pudo cargar db.json local, usando fallback.', e);
      return this.getFallbackData();
    }
  }

  // ----------------------------------------------------

// dentro de la clase ApiService
    async getReportUploadUrl(reportId, { contentType = "application/pdf" } = {}) {
      return this.request(`/api/reports/${reportId}/upload-url`, {
        method: "POST",
        body: JSON.stringify({ contentType }),
      });
    }



      // Lista solo reportes que tienen PDF
  async getReportesPdf({ limit = 20, cursor = null } = {}) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);
    return this.request(`/api/reports/pdfs?${params.toString()}`);
  }

  // Devuelve una URL firmada para ver/descargar el PDF
  async getPdfUrl(reporteId) {
    const data = await this.request(`/api/reports/${reporteId}/pdf-url`);
    return data?.url || null;
  }





  // Datos de respaldo
  getFallbackData() {
    return [
      {
        id: 'INS-2025-001',
        status: 'approved',
        metadata: { completado: true },
        elaboracion: { elaborado_por: 'María González', fecha_elaboracion: '2025-07-15' },
        datos_inspeccion: { area: 'Área de Producción', producto: 'Producto B - Categoría 2', lote: 'PRD-789' },
        defectos: { total_general: 0 },
        fecha: '2025-07-15',
      },
      {
        id: 'INS-2025-002',
        status: 'rejected',
        metadata: { completado: true },
        elaboracion: { elaborado_por: 'Juan Pérez', fecha_elaboracion: '2025-07-18' },
        datos_inspeccion: { area: 'Área de Empaque', producto: 'Producto C - Categoría 3', lote: 'EMP-456' },
        defectos: { total_general: 10 },
        fecha: '2025-07-18',
      },
      {
        id: 'INS-2025-003',
        status: 'pending',
        metadata: { completado: false },
        elaboracion: { elaborado_por: 'Luisa Ramírez', fecha_elaboracion: '2025-07-20' },
        datos_inspeccion: { area: 'Área de Almacén', producto: '', lote: '' },
        defectos: { total_general: null },
        fecha: '2025-07-20',
      },
    ];
  }
}

// Singleton
const apiService = new ApiService();
export default apiService;

