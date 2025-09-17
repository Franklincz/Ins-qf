import React, { useState, useEffect, useCallback , useRef} from 'react';
import apiService from '../../../services/api.js';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  CloseButton,
  HistoryList,
  HistoryItem,
  HistoryDate,
  HistoryTitle,
  HistoryStatus,
  FilterSection,
  FilterButton,
  NoResults,
  DeleteButton,
  ConfirmDialog,
  DialogOverlay,
  DialogActions,
  DialogButton,
  ClearAllButton,
  HeaderActions,
  LoadingSpinner,
  ErrorMessage,
  RefreshButton
} from './HistoryModal.style.js';

/* -------- helpers de estado y formato -------- */
const normalizeStatus = (s = '') => (
  { aprobado: 'approved', pendiente: 'pending', rechazado: 'rejected' }[s] || s
);
const displayStatus = (s = '') =>
  ({ approved: 'Aprobado', pending: 'Pendiente', rejected: 'Rechazado' }[normalizeStatus(s)] || 'Desconocido');

const statusColor = (s = '') => {
  switch (normalizeStatus(s)) {
    case 'approved': return '#28a745';
    case 'pending':  return '#ffc107';
    case 'rejected': return '#dc3545';
    default:         return '#6c757d';
  }
};

const toESDate = (v) => {
  if (!v) return 'Fecha no disponible';
  try {
    const d = v instanceof Date ? v : new Date(v);
    if (Number.isNaN(d.getTime())) return 'Fecha no disponible';
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch { return 'Fecha no disponible'; }
};

/* ---------------- componente ----------------- */
const HistoryModal = ({ isOpen, onClose, onSelectItem }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'approved' | 'pending' | 'rejected'
  const [historyData, setHistoryData] = useState([]);
  const [nextCursorByTab, setNextCursorByTab] = useState({ all: null, approved: null, pending: null, rejected: null });

  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // >>> NUEVO: id de petición para evitar condiciones de carrera
  const reqIdRef = useRef(0);
  /* --------- listeners online/offline ---------- */
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  /* ------------- carga inicial/por tab --------- */
    const loadHistoryData = useCallback(
  async (append = false, forFilter = filter) => {
    const myReqId = ++reqIdRef.current;     // id de esta petición
    setLoading(true);
    setError(null);

    try {
      const cursor = append ? nextCursorByTab[forFilter] : null;
      // NO enviar 'all' al backend:
      const statusParam = forFilter === 'all' ? undefined : forFilter;

      const { items, nextCursor } = await apiService.getReportesForHistory({
        status: statusParam,
        limit: 20,
        cursor
      });

      // Si llegó tarde, ignoramos
      if (reqIdRef.current !== myReqId) return;

      setHistoryData(prev => (append ? [...prev, ...items] : items));
      setNextCursorByTab(prev => ({ ...prev, [forFilter]: nextCursor }));
    } catch (err) {
      console.error('Error cargando historial:', err);

      // Si llegó tarde, ignoramos
      if (reqIdRef.current !== myReqId) return;

      setError('No se pudo cargar el historial.');
      // ⚠️ Ya NO hay fallback a JSON local (carga en duro eliminada)
      setHistoryData(prev => (append ? prev : []));
      setNextCursorByTab(prev => ({ ...prev, [forFilter]: null }));
    } finally {
      if (reqIdRef.current === myReqId) setLoading(false);
    }
  },
  [filter, nextCursorByTab]
);


  // cuando se abre el modal
  useEffect(() => {
  if (isOpen) loadHistoryData(false, filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen]);


  // cambiar pestaña => recargar página 1
  const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  setHistoryData([]);
  // Reinicia el cursor de esa pestaña para paginación coherente
  setNextCursorByTab(prev => ({ ...prev, [newFilter]: null }));
  loadHistoryData(false, newFilter);
};


  const refreshData = () => loadHistoryData(false, filter);

const loadMore = () => {
  if (nextCursorByTab[filter]) loadHistoryData(true, filter);
};


  /* ------------------ acciones ----------------- */
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      // eliminamos del server (si está online)
      if (isOnline) {
        try { await apiService.deleteReporte(itemToDelete.id); }
        catch (e) { console.warn('No se pudo eliminar del servidor:', e); }
      }
      // optimista: sacar del estado
      setHistoryData(prev => prev.filter(it => it.id !== itemToDelete.id));
      setShowConfirm(false);
      setItemToDelete(null);
    } catch (e) {
      console.error('Error eliminando reporte:', e);
      setError('Error al eliminar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClearAll = async () => {
    try {
      setLoading(true);
      if (isOnline) {
        try { await apiService.clearAllReportes(); }
        catch (e) { console.warn('No se pudo vaciar en servidor:', e); }
      } else {
        // si estás offline, sólo limpias localmente
      }
      setHistoryData([]);
      setNextCursorByTab(prev => ({ ...prev, [filter]: null }));
      setShowClearAllConfirm(false);
    } catch (e) {
      console.error('Error limpiando historial:', e);
      setError('Error al limpiar el historial');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- render ------------------ */
  if (!isOpen) return null;

  const totalAll = historyData.length;
  const totalApproved = historyData.filter(it => normalizeStatus(it.status) === 'approved').length;
  const totalPending  = historyData.filter(it => normalizeStatus(it.status) === 'pending').length;
  const totalRejected = historyData.filter(it => normalizeStatus(it.status) === 'rejected').length;

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div>
              <h2>Historial de Reportes</h2>
              {!isOnline && <small style={{ color: '#ffc107', fontSize: '0.75rem' }}>📶 Modo sin conexión - Datos locales</small>}
            </div>
            <HeaderActions>
              <RefreshButton onClick={refreshData} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </RefreshButton>

              {historyData.length > 0 && (
                <ClearAllButton onClick={() => setShowClearAllConfirm(true)} disabled={loading}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Vaciar Todo
                </ClearAllButton>
              )}

              <CloseButton onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </CloseButton>
            </HeaderActions>
          </ModalHeader>

          <FilterSection>
            <FilterButton $active={filter === 'all'} onClick={() => handleFilterChange('all')}>
              Todos ({totalAll})
            </FilterButton>
            <FilterButton $active={filter === 'approved'} onClick={() => handleFilterChange('approved')}>
              Aprobados ({totalApproved})
            </FilterButton>
            <FilterButton $active={filter === 'pending'} onClick={() => handleFilterChange('pending')}>
              Pendientes ({totalPending})
            </FilterButton>
            <FilterButton $active={filter === 'rejected'} onClick={() => handleFilterChange('rejected')}>
              Rechazados ({totalRejected})
            </FilterButton>
          </FilterSection>

          <ModalBody>
            {error && (
              <ErrorMessage>
                ⚠️ {error}
                <button onClick={refreshData} style={{ marginLeft: 10 }}>Reintentar</button>
              </ErrorMessage>
            )}

            {loading && historyData.length === 0 ? (
              <LoadingSpinner>
                <div className="spinner"></div>
                <p>Cargando historial...</p>
              </LoadingSpinner>
            ) : (
              <HistoryList>
                {historyData.length > 0 ? (
                  <>
                    {historyData.map(item => (
                      <HistoryItem key={item.id} onClick={() => { onSelectItem?.(item); onClose(); }} style={{ cursor: 'pointer' }}>
                        <HistoryDate>{toESDate(item.date)}</HistoryDate>
                        <HistoryTitle>
                          <strong>{item.product || 'Producto no especificado'}</strong>
                          {item.lot && ` - ${item.lot}`}
                          <br />
                          <small>{item.area || 'Área no especificada'}</small>
                          {item.elaborado_por && (
                            <>
                              <br />
                              <small style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                Por: {item.elaborado_por}
                              </small>
                            </>
                          )}
                          {(item.total_defectos ?? null) !== null && (
                            <>
                              <br />
                              <small style={{ color: (item.total_defectos > 0 ? '#dc3545' : '#28a745'), fontWeight: 'bold' }}>
                                Defectos: {item.total_defectos}
                              </small>
                            </>
                          )}
                        </HistoryTitle>
                        <HistoryStatus color={statusColor(item.status)}>
                          {displayStatus(item.status)}
                          {!item.completado && (
                            <>
                              <br />
                              <small style={{ fontSize: '0.65rem', opacity: 0.8 }}>Incompleto</small>
                            </>
                          )}
                        </HistoryStatus>
                        <DeleteButton
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(item); }}
                          title={`Eliminar reporte ${item.id}`}
                          disabled={loading}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </DeleteButton>
                      </HistoryItem>
                    ))}

                    {/* Paginación: Cargar más */}
                    {nextCursorByTab[filter] && !loading && (
                      <div style={{ textAlign: 'center', padding: 12 }}>
                        <button onClick={loadMore}>Cargar más</button>
                      </div>
                    )}
                  </>
                ) : (
                  <NoResults>
                    {filter === 'all'
                      ? 'No se encontraron reportes en el historial'
                      : `No se encontraron reportes ${displayStatus(filter).toLowerCase()}`}
                  </NoResults>
                )}
              </HistoryList>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      {/* Confirmar borrado individual */}
      {showConfirm && (
        <DialogOverlay>
          <ConfirmDialog>
            <h3>Confirmar eliminación</h3>
            <p>¿Eliminar el reporte <strong>{itemToDelete?.id}</strong>?</p>
            <p>
              <strong>Producto:</strong> {itemToDelete?.product || 'No especificado'}
              {itemToDelete?.lot && <><br /><strong>Lote:</strong> {itemToDelete.lot}</>}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>Esta acción no se puede deshacer.</p>
            <DialogActions>
              <DialogButton variant="secondary" onClick={() => setShowConfirm(false)} disabled={loading}>Cancelar</DialogButton>
              <DialogButton variant="danger" onClick={handleConfirmDelete} disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </DialogButton>
            </DialogActions>
          </ConfirmDialog>
        </DialogOverlay>
      )}

      {/* Confirmar vaciar todo */}
      {showClearAllConfirm && (
        <DialogOverlay>
          <ConfirmDialog>
            <h3>Vaciar historial completo</h3>
            <p>¿Deseas eliminar <strong>todos los reportes</strong> del historial?</p>
            <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              Se eliminarán <strong>{historyData.length}</strong> reportes. Esta acción no se puede deshacer.
            </p>
            <DialogActions>
              <DialogButton variant="secondary" onClick={() => setShowClearAllConfirm(false)} disabled={loading}>Cancelar</DialogButton>
              <DialogButton variant="danger" onClick={handleConfirmClearAll} disabled={loading}>
                {loading ? 'Eliminando...' : 'Vaciar Todo'}
              </DialogButton>
            </DialogActions>
          </ConfirmDialog>
        </DialogOverlay>
      )}
    </>
  );
};

export default HistoryModal;
