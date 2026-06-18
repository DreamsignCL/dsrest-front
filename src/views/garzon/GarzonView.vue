<template>
    <div class="page page--backoffice">
        <InnerHeader @open-qr="abrirQrModal" />
        <main>
            <div class="page-content page-content--backoffice">
                <div class="page-content__header">
                    <div class="user-logo">
                        <div class="user-logo__image">
                            <img v-if="local?.foto" :src="local.foto" alt="Logo del Local" />
                            <img v-else src="../../assets/img/no-logo.png" alt="Sin logo" />
                        </div>
                    </div>

                    <div class="title">
                        <strong class="text-primary">Bienvenido(a)</strong><br>
                        <h2 class="fw-normal">{{ usuario?.nombre || '[*Nombre de Usuario*]' }}</h2>
                    </div>
                </div>

                <div v-if="!esAdmin" class="quick-status-tabs" role="tablist" aria-label="Filtros rápidos por estado">
                    <button
                        v-for="tab in pestanasEstadoRapido"
                        :key="tab.key"
                        type="button"
                        class="quick-status-tabs__tab"
                        :class="{ 'is-active': pestanaEstadoRapido === tab.key }"
                        @click="seleccionarPestanaEstado(tab.key)"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <div class="page-content__body">
                    <div class="list-filters">
                        <button class="btn btn-outline-secondary btn-filter" type="button" @click="abrirModalFiltros">
                            <img src="../../assets/img/filter-icon.svg" alt="">
                        </button>
                        <form v-if="esAdmin" class="admin-list-filters-form">
                            <input id="search" class="form-control" type="search" placeholder="Buscar..." v-model="filtroBusqueda">
                        </form>
                        <form v-else class="garzon-list-filters-form">
                            <input id="search" class="form-control" type="search" placeholder="Buscar..." v-model="filtroBusqueda">
                        </form>
                    </div>

                    <!--
                    <div v-if="esAdmin" class="admin-financial-summary">
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">SUBTOTAL</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.subtotal) }}</strong>
                        </div>
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">PROPINA 10%</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.propina) }}</strong>
                        </div>
                        <div class="admin-financial-summary__card">
                            <span class="admin-financial-summary__label">TOTAL</span>
                            <strong class="admin-financial-summary__value">{{ formatearMoneda(resumenFinanciero.total) }}</strong>
                        </div>
                    </div>
                    -->

                    <div v-if="esAdmin" class="financial-summary">
                        <div class="financial-summary__item">
                            <div class="financial-summary__icon">      
                                <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0V19.5H15V0H0ZM1.5 1.5H13.5V18H1.5V1.5ZM3 3V7.5H12V3H3ZM4.5 4.5H10.5V6H4.5V4.5ZM3.75 9V10.5H5.25V9H3.75ZM6.75 9V10.5H8.25V9H6.75ZM9.75 9V10.5H11.25V9H9.75ZM3.75 12V13.5H5.25V12H3.75ZM6.75 12V13.5H8.25V12H6.75ZM9.75 12V13.5H11.25V12H9.75ZM3.75 15V16.5H5.25V15H3.75ZM6.75 15V16.5H8.25V15H6.75ZM9.75 15V16.5H11.25V15H9.75Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span>NETO (sin IVA)</span>
                            <strong class="financial-summary__value">
                                {{ formatearMoneda(resumenFinanciero.neto) }}
                            </strong>
                        </div>

                        <div class="financial-summary__item">
                            <div class="financial-summary__icon">
                                <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.2608 16H14.5701L18.67 0H21.9059L26 16H23.3092L20.3343 3.65625H20.2415L17.2608 16ZM17.0927 9.71094H23.4484V12.3516H17.0927V9.71094Z" fill="currentColor"/>
                                    <path d="M6.72257 0L9.59309 12.1562H9.70327L12.5796 0H15.3631L11.269 16H8.03315L3.93323 0H6.72257Z" fill="currentColor"/>
                                    <path d="M2.51098 0V16H0V0H2.51098Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span>IVA (19%)</span>
                            <strong class="financial-summary__value">
                                {{ formatearMoneda(resumenFinanciero.iva) }}
                            </strong>
                        </div>

                        <div class="financial-summary__item">
                            <div class="financial-summary__icon">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.75 0C11.4053 0 10.1865 0.251953 9.23438 0.726562C8.28223 1.20117 7.5 1.97461 7.5 3V6C7.5 6.09668 7.53223 6.19043 7.54688 6.28125C6.84961 6.09961 6.07617 6 5.25 6C3.90527 6 2.68652 6.25195 1.73438 6.72656C0.782227 7.20117 0 7.97461 0 9V15C0 16.0254 0.782227 16.7988 1.73438 17.2734C2.68652 17.748 3.90527 18 5.25 18C6.59473 18 7.81348 17.748 8.76562 17.2734C9.71777 16.7988 10.5 16.0254 10.5 15V14.6953C11.1885 14.877 11.9414 15 12.75 15C14.0947 15 15.3135 14.748 16.2656 14.2734C17.2178 13.7988 18 13.0254 18 12V3C18 1.97461 17.2178 1.20117 16.2656 0.726562C15.3135 0.251953 14.0947 0 12.75 0ZM12.75 1.5C13.8926 1.5 14.9092 1.74609 15.5859 2.08594C16.2627 2.42578 16.5 2.7832 16.5 3C16.5 3.2168 16.2627 3.57422 15.5859 3.91406C14.9092 4.25391 13.8926 4.5 12.75 4.5C11.6074 4.5 10.5908 4.25391 9.91406 3.91406C9.2373 3.57422 9 3.2168 9 3C9 2.7832 9.2373 2.42578 9.91406 2.08594C10.5908 1.74609 11.6074 1.5 12.75 1.5ZM9 5.13281C9.0791 5.17676 9.15234 5.23242 9.23438 5.27344C10.1865 5.74805 11.4053 6 12.75 6C14.0947 6 15.3135 5.74805 16.2656 5.27344C16.3477 5.23242 16.4209 5.17676 16.5 5.13281V6C16.5 6.2168 16.2627 6.57422 15.5859 6.91406C14.9092 7.25391 13.8926 7.5 12.75 7.5C11.6074 7.5 10.5908 7.25391 9.91406 6.91406C9.2373 6.57422 9 6.2168 9 6V5.13281ZM5.25 7.5C6.39258 7.5 7.40918 7.74609 8.08594 8.08594C8.7627 8.42578 9 8.7832 9 9C9 9.2168 8.7627 9.57422 8.08594 9.91406C7.40918 10.2539 6.39258 10.5 5.25 10.5C4.10742 10.5 3.09082 10.2539 2.41406 9.91406C1.7373 9.57422 1.5 9.2168 1.5 9C1.5 8.7832 1.7373 8.42578 2.41406 8.08594C3.09082 7.74609 4.10742 7.5 5.25 7.5ZM16.5 8.13281V9C16.5 9.2168 16.2627 9.57422 15.5859 9.91406C14.9092 10.2539 13.8926 10.5 12.75 10.5C11.8975 10.5 11.127 10.3594 10.5 10.1484V9C10.5 8.90332 10.4678 8.80957 10.4531 8.71875C11.1504 8.90039 11.9238 9 12.75 9C14.0947 9 15.3135 8.74805 16.2656 8.27344C16.3477 8.23242 16.4209 8.17676 16.5 8.13281ZM1.5 11.1328C1.5791 11.1768 1.65234 11.2324 1.73438 11.2734C2.68652 11.748 3.90527 12 5.25 12C6.59473 12 7.81348 11.748 8.76562 11.2734C8.84766 11.2324 8.9209 11.1768 9 11.1328V12C9 12.2168 8.7627 12.5742 8.08594 12.9141C7.40918 13.2539 6.39258 13.5 5.25 13.5C4.10742 13.5 3.09082 13.2539 2.41406 12.9141C1.7373 12.5742 1.5 12.2168 1.5 12V11.1328ZM16.5 11.1328V12C16.5 12.2168 16.2627 12.5742 15.5859 12.9141C14.9092 13.2539 13.8926 13.5 12.75 13.5C11.8975 13.5 11.127 13.3799 10.5 13.1719V11.7188C11.1885 11.9004 11.9385 12 12.75 12C14.0947 12 15.3135 11.748 16.2656 11.2734C16.3477 11.2324 16.4209 11.1768 16.5 11.1328ZM1.5 14.1328C1.5791 14.1768 1.65234 14.2324 1.73438 14.2734C2.68652 14.748 3.90527 15 5.25 15C6.59473 15 7.81348 14.748 8.76562 14.2734C8.84766 14.2324 8.9209 14.1768 9 14.1328V15C9 15.2168 8.7627 15.5742 8.08594 15.9141C7.40918 16.2539 6.39258 16.5 5.25 16.5C4.10742 16.5 3.09082 16.2539 2.41406 15.9141C1.7373 15.5742 1.5 15.2168 1.5 15V14.1328Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span>PROPINA</span>
                            <strong class="financial-summary__value">
                                {{ formatearMoneda(resumenFinanciero.propina) }}
                            </strong>
                        </div>

                        <div class="financial-summary__item">
                            <div class="financial-summary__icon">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 0V18H6V3H1.5V18H0V19.5H19.5V18H18V8.25H13.5V18H12V0H7.5ZM9 1.5H10.5V18H9V1.5Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <span>TOTAL GENERAL</span>
                            <strong class="financial-summary__value">
                                {{ formatearMoneda(resumenFinanciero.total) }}
                            </strong>
                        </div>
                    </div>

                    <!-- Lista de atenciones -->
                    <div class="element-list" v-if="atencionesFiltradas.length > 0">
                        <div v-for="(atencion, index) in atencionesFiltradas" :key="atencion.id">
                            <button
                                class="element-item element-item--atention"
                                type="button"
                                :key="atencion.id" 
                                :class="{ active: atencion.isActive }" 
                                @click="toggleAtentionActive(atencion)">
                                <template v-if="esAdmin">
                                    <div class="element-item__row">
                                        <div class="element-item__col element-item__col--order">
                                            <strong>Nº Pedido: {{ atencion.numeroPedido || atencion.id }}</strong>
                                        </div>
                                        <div class="element-item__col element-item__col--date">
                                            {{ atencion.fecha }} {{ formatearHoraAMPM(atencion.hora) }}
                                        </div>
                                    </div>
                                    <div class="element-item__row">
                                        <div class="element-item__col element-item__col--waiter">
                                            <span>Garzón:</span>
                                            {{ atencion.garzon || '-' }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Ubicación:</span>
                                            {{ atencion.ubicacion }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Mesa:</span>
                                            {{ atencion.mesa || atencion.numero }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Estado:</span>
                                            {{ atencion.estado }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Total:</span>
                                            <strong>{{ formatearMoneda(atencion.total) }}</strong>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="element-item__row">
                                        <div class="element-item__col element-item__col--order">
                                            <strong>Nº Pedido: {{ atencion.numeroPedido || atencion.id }}</strong>
                                        </div>
                                        <div class="element-item__col element-item__col--date">
                                            {{ atencion.fecha }} {{ formatearHoraAMPM(atencion.hora) }}
                                        </div>
                                    </div>
                                    <div class="element-item__row">
                                        <div class="element-item__col element-item__col--waiter">
                                            <span>Garzón:</span>
                                            {{ atencion.garzon || usuario?.nombre || '-' }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Ubicación:</span>
                                            {{ atencion.ubicacion }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Mesa:</span>
                                            {{ atencion.mesa || atencion.numero }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Estado:</span>
                                            {{ atencion.estado }}
                                        </div>
                                        <div class="element-item__col">
                                            <span>Total:</span>
                                            <strong>{{ formatearMoneda(atencion.total) }}</strong>
                                        </div>
                                    </div>
                                </template>
                                <div class="element-item__options-menu">
                                    <button v-if="atencion.estado === 'pagado'" class="btn btn-option" @click="verAtencion(atencion)">
                                        <img src="../../assets/img/eye-icon.svg" alt="Ver" />
                                    </button>
                                    <button v-else class="btn btn-option" @click="editarAtencion(atencion)">
                                        <img src="../../assets/img/edit-icon.svg" alt="Editar" />
                                    </button>
                                    <button class="btn btn-option" @click="confirmarEliminarAtencion(atencion)">
                                        <img src="../../assets/img/delete-icon.svg" alt="Eliminar" />
                                    </button>
                                    <button class="btn btn-option">
                                        <img src="../../assets/img/close-skyblue-icon.svg" alt="Cerrar" />
                                    </button>
                                </div>
                            </button>

                            <!--
                                <div class="d-flex align-items-center justify-content-between">
                                    <div
                                        class="numero-mesa bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                        {{ atencion.numero }}
                                    </div>
                                    <div
                                        class="info-atencion flex-grow-1 d-flex justify-content-between text-center">
                                        <div class="col">
                                            <div><strong>Ubicación</strong></div>
                                            <div>{{ atencion.ubicacion }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Estado</strong></div>
                                            <div>{{ atencion.estado }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Fecha</strong></div>
                                            <div>{{ atencion.fecha }}</div>
                                        </div>
                                        <div class="col">
                                            <div><strong>Hora</strong></div>
                                            <div>{{ atencion.hora }}</div>
                                        </div>
                                    </div>
                                    <div class="menu-opciones ms-2 position-relative">
                                        <img src="../../assets/img/ellipsis-vertical-icon.svg" alt="Opciones"
                                            @click="toggleMenu(atencion.id)"
                                            style="cursor: pointer; width: 24px;" />
                                        <div v-if="menuAbierto === atencion.id" class="options-menu">
                                            <button class="menu-item" @click="editarAtencion(atencion)">
                                                <img src="../../assets/img/edit-icon.svg" alt="Editar"
                                                    style="width: 18px; margin-right: 6px;" />
                                                Editar
                                            </button>
                                            <button class="menu-item text-danger"
                                                @click="confirmarEliminarAtencion(atencion)">
                                                <img src="../../assets/img/delete-icon.svg" alt="Eliminar"
                                                    style="width: 18px; margin-right: 6px;" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            -->


                            <!-- Detalle del pedido -->
                            <div v-if="detalleVisible === atencion.id" class="px-2 mt-3">
                                <h6>Editar pedido:</h6>
                                <ul class="list-group">
                                    <!-- Agregar más platos -->
                                    <div class="mt-3">
                                        <SelectorPlatos :platosDisponibles="platosDisponibles"
                                            @plato-seleccionado="agregarPlatoAAtencion(atencion.id, $event)" />
                                    </div>
                                    <li v-for="(detalle, i) in detallesPedido[atencion.id]?.detalles"
                                        :key="detalle.id"
                                        class="list-group-item d-flex justify-content-between align-items-center rounded shadow-sm plato-item-small mb-2">
                                        <div class="d-flex align-items-center justify-content-between w-100">
                                            <div class="d-flex align-items-start gap-4 flex-wrap">
                                                <div>
                                                    <div v-if="detalle.editando"
                                                        class="d-flex align-items-center gap-2">
                                                        <input type="number" min="1"
                                                            v-model.number="detalle.quantity"
                                                            @input="actualizarPrecio(detalle)"
                                                            class="form-control form-control-sm"
                                                            style="width: 70px;" />
                                                        <strong>{{ detalle.plato?.nombre }}</strong>
                                                    </div>
                                                    <div v-else>
                                                        <strong>x{{ detalle.quantity }}</strong> <strong>{{
                                                            detalle.plato?.nombre }}</strong>
                                                    </div>
                                                </div>

                                                <div class="d-flex flex-column">
                                                    <strong>Precio ud.</strong>
                                                    <span>${{ parseFloat(detalle.unit_price).toLocaleString()}}</span>
                                                </div>

                                                <div class="d-flex flex-column">
                                                    <strong>Total</strong>
                                                    <span>${{ (detalle.quantity * detalle.unit_price).toLocaleString() }}</span>
                                                </div>
                                            </div>

                                            <div class="d-flex align-items-center gap-2">
                                                <button class="btn btn-sm btn-primary rounded-circle"
                                                    title="Editar cantidad"
                                                    @click.prevent="editarCantidad(atencion.id, i)">
                                                    <img src="../../assets/img/edit-icon.svg" alt="Editar"
                                                        style="width: 15px; height: 15px; filter: brightness(0) invert(1);" />
                                                </button>
                                                <button class="btn btn-sm btn-danger rounded-circle"
                                                    @click="eliminarPlato(atencion.id, i)" title="Eliminar">
                                                    <img src="../../assets/img/close-skyblue-icon.svg" alt="Eliminar"
                                                        style="width: 15px; height: 15px; filter: brightness(0) invert(1);" />
                                                </button>
                                                <button v-if="detalle.editando"
                                                    class="btn btn-sm btn-outline-primary"
                                                    @click="cancelarEdicion(atencion.id, i)">
                                                    Cancelar
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                </ul>

                                <div class="text-end pe-2 mt-2">
                                    <strong>Total:</strong> ${{ calcularTotal(atencion.id).toLocaleString() }}
                                </div>

                                <div class="text-end pe-2 mt-2">
                                    <!-- Mostrar botón Guardar cambios solo si hay cambios -->
                                    <button v-if="hayCambios(atencion.id)"
                                        class="btn btn-outline-primary btn-sm"
                                        @click="mostrarConfirmacion('¿Guardar los cambios del pedido?', () => guardarCambiosPedido(atencion.id))">
                                        Guardar cambios
                                    </button>

                                    <!-- Si no hay cambios, mostrar botón para cambiar estado -->
                                    <button v-else class="btn btn-primary btn-sm ms-2"
                                        :class="{ 'btn-outline-secondary': !tieneSiguienteTransicion(atencion.id) }"
                                        @click="manejarAccionEstado(atencion)">
                                        {{ obtenerTextoBotonEstado(atencion.id) }}
                                    </button>

                                    <!-- Botón para cancelar los cambios -->
                                    <button class="btn btn-outline-danger btn-sm ms-2"
                                        @click="cancelarEdicionPedido(atencion.id)">
                                        Cancelar
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-muted">
                        <p>No tienes atenciones registradas.</p>
                    </div>
                </div>

                <div class="page-content__footer">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary rounded-pill" @click="irANuevaAtencion">
                            Nuevo pedido
                        </button>
                    </div>
                    <Signature />
                </div>

                <!-- Modal QR -->
                <QrModal :isOpen="showQrModal" :localNombre="localNombre" @close="cerrarQrModal" />

                <!-- Modal de filtros -->
                <div v-if="showModalFiltros" class="modal animate__animated animate__fadeIn" @click.self="cerrarModalFiltros">
                    <div class="modal-content animate__animated animate__fadeInUp" @click.stop>
                        <div class="modal-header">
                            <h4 class="modal-title">Orden y filtros</h4>
                            <button class="btn-close" type="button" @click="cerrarModalFiltros"></button>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label" for="list-order">Ordenar por:</label>
                            <select id="list-order" class="form-select form-select-sm" aria-label="Orden de la lista" v-model="ordenarPor">
                                <option value="">Selecciona</option>
                                <option value="fecha">Por Fecha</option>
                                <option value="monto">Por Monto</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="estado">Estado:</label>

                            <select class="form-select form-select-sm" v-model="estadoSeleccionado">
                                <option value="">Todos</option>
                                <option
                                    v-for="estado in estadosPedido"
                                    :key="estado.id"
                                    :value="estado.nombre.toLowerCase()"
                                >
                                    {{ estado.nombre }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                          <label class="form-label" for="zones">Zona:</label>
                          <select id="zones" class="form-select form-select-sm" v-model="zonaSeleccionada">
                            <option value="">Todas</option>
                            <option v-for="zona in zonas" :key="zona.id" :value="zona.nombre">
                              {{ zona.nombre }}
                            </option>
                          </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Rango de fechas:</label>

                            <div class="admin-date-input mb-2">
                                <input class="form-control" type="date" v-model="fechaInicio">
                                <span class="admin-date-input__label">Desde</span>
                            </div>

                            <div class="admin-date-input">
                                <input class="form-control" type="date" v-model="fechaFin">
                                <span class="admin-date-input__label">Hasta</span>
                            </div>
                        </div>

                        <div class="d-flex justify-content-start gap-3 mb-3">
                            <div class="form-check">
                                <input id="proprity-order1" class="form-check-input" type="radio" v-model="ascendente" :value="true" />
                                <label class="form-check-label" for="proprity-order1">Ascendente</label>
                            </div>
                            <div class="form-check">
                                <input id="proprity-order2" class="form-check-input" type="radio" v-model="ascendente" :value="false" />
                                <label class="form-check-label" for="proprity-order2">Descendente</label>
                            </div>
                        </div>

                        <div class="modal-footer justify-content-center">
                            <button class="btn btn-outline-primary rounded-pill" type="button" @click="cerrarModalFiltros">
                                Cancelar
                            </button>
                            <button class="btn btn-primary rounded-pill" type="button" @click="aplicarFiltros">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Modal de Confirmación -->
                <ConfirmModal :show="showConfirmModal" :message="confirmMessage" @confirm="onConfirm" @cancel="onCancel" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/api.service'
import InnerHeader from '@/components/InnerHeader.vue'
import QrModal from '@/components/QrModal.vue'
import Signature from '@/components/Signature.vue'
import SelectorPlatos from '@/components/garzon/SelectorPlatos.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const showQrModal = ref(false)
const usuario = ref(null)
const local = ref(null)
const atenciones = ref([])
const transicionesPorPedido = ref({})
const detalleVisible = ref(null)
const detallesPedido = ref({})
const detallesOriginales = ref({})
const platosDisponibles = ref([])
const mostrarModal = ref(false)
const accionModal = ref(null)
const pedidoIdModal = ref(null)
const menuAbierto = ref(null)
const filtroBusqueda = ref('')
const fechaFiltro = ref('')
const fechaInicio = ref('')
const fechaFin = ref('')
const showConfirmModal = ref(false)
const confirmMessage = ref('')
let confirmAction = null
const QUICK_TAB_STORAGE_KEY = 'garzon-atencion-tab'
const pestanaEstadoRapido = ref('todos')

const showModalFiltros = ref('')
const ordenarPor = ref('')
const ascendente = ref(true)
const filtroPendientes = ref(true)
const filtroTerminados = ref(false)

const zonas = ref([])
const zonaSeleccionada = ref('')
const estadosPedido = ref([])
const estadosSeleccionados = ref([])
const estadoSeleccionado = ref('')
const empresaConfig = ref({ usaMesas: 'si', usaNombreCliente: 'no' })

const esAdmin = computed(() => usuario.value?.usuarioRolesLocales?.[0]?.rolId === 1)

/*
const resumenFinanciero = computed(() => {
    if (!esAdmin.value) {
        return { subtotal: 0, propina: 0, total: 0 }
    }

    const subtotal = atenciones.value
        .filter((pedido) => normalizarEstado(pedido.estado) === 'pagado')
        .reduce((acum, pedido) => acum + parseMonto(pedido.total), 0)

    const propina = subtotal * 0.1

    return {
        subtotal,
        propina,
        total: subtotal + propina,
    }
})
*/

const resumenFinanciero = computed(() => {
    if (!esAdmin.value) {
        return { neto: 0, iva: 0, subtotal: 0, propina: 0, total: 0 }
    }

    const pagados = atenciones.value
        .filter(p => normalizarEstado(p.estado) === 'pagado')

    const subtotal = pagados.reduce((acc, p) => acc + parseMonto(p.total), 0)
    const propina = pagados.reduce((acc, p) => acc + parseMonto(p.propinaPagada), 0)

    const neto = Math.round(subtotal * 100 / 119)
    const iva = subtotal - neto

    return {
        neto,
        iva,
        subtotal,
        propina,
        total: subtotal + propina,
    }
})

const pestanasEstadoRapido = computed(() => {
    const tabs = [{ key: 'todos', label: 'Todos', estadoNombre: '' }]
    const usados = new Set(['todos'])

    const estadosOrdenados = [...estadosPedido.value]
        .filter((estado) => estado?.activo !== false)
        .sort((a, b) => {
            const ordenA = Number.isFinite(Number(a?.orden)) ? Number(a.orden) : Number.MAX_SAFE_INTEGER
            const ordenB = Number.isFinite(Number(b?.orden)) ? Number(b.orden) : Number.MAX_SAFE_INTEGER
            if (ordenA !== ordenB) return ordenA - ordenB
            return String(a?.nombre || '').localeCompare(String(b?.nombre || ''))
        })

    for (const estado of estadosOrdenados) {
        const nombre = (estado?.nombre || '').trim()
        if (!nombre) continue

        const key = normalizarEstado(nombre)
        if (!key || usados.has(key)) continue

        usados.add(key)
        tabs.push({ key, label: nombre.charAt(0).toUpperCase() + nombre.slice(1), estadoNombre: nombre })
    }

    return tabs
})

const confirmarAccion = (accion, pedidoId) => {
    accionModal.value = accion
    pedidoIdModal.value = pedidoId
    mostrarModal.value = true
}

const ejecutarAccion = async () => {
    mostrarModal.value = false
    const id = pedidoIdModal.value
    if (accionModal.value === 'guardar') {
        await guardarCambiosPedido(id)
    } else if (accionModal.value === 'estado') {
        await cambiarEstadoPedido(id)
    }
}

const obtenerLocal = () => {
    const localStr = localStorage.getItem('local')
    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}

const obtenerEmpresaConfig = async () => {
    try {
        const localId = local.value?.id
        if (!localId) return
        const config = await apiService.get(`empresas/por-local/${localId}`)
        if (config) {
            empresaConfig.value = {
                usaMesas: config.usaMesas || 'si',
                usaNombreCliente: config.usaNombreCliente || 'no',
                tipoNegocio: config.tipoNegocio || null,
            }
        }
    } catch (e) {
        // mantener defaults si falla
    }
}

const obtenerUsuario = () => {
    const userStr = localStorage.getItem('user')
    const localStr = localStorage.getItem('local')

    if (userStr) {
        usuario.value = JSON.parse(userStr)
    }

    if (localStr) {
        local.value = JSON.parse(localStr)
    }
}


const obtenerAtenciones = async () => {
    try {
        const localId = local.value?.id
        if (!localId) {
            console.error('No se encontró el localId')
            return
        }
        let res
        if (usuario.value?.usuarioRolesLocales?.[0]?.rolId === 1) {
            // Administrador: obtiene todos los pedidos del local
            res = await apiService.get(`pedidos/porlocal/${localId}`)
        } else {
            // Garzón: solo sus pedidos
            res = await apiService.get(`pedidos/mispedidos/local/${localId}`)
        }
        atenciones.value = res
        
        console.log('ATENCIONES:', res)

        if (res.length > 0) {
            console.log('PRIMER PEDIDO:', res[0])
        }
        
        // Se limpian para evitar datos stale y cargar transiciones solo bajo demanda.
        transicionesPorPedido.value = {}
    } catch (error) {
        console.error('Error al obtener atenciones:', error)
    }
}

const obtenerTransicionPedido = async (pedidoId) => {
    try {
        const transiciones = await apiService.get(`workflow-pedidos/${pedidoId}/transiciones`)
        return Array.isArray(transiciones) && transiciones.length > 0 ? transiciones[0] : null
    } catch (error) {
        console.error(`Error al obtener transiciones del pedido ${pedidoId}:`, error)
        return undefined
    }
}

const asegurarTransicionPedido = async (pedidoId) => {
    if (Object.prototype.hasOwnProperty.call(transicionesPorPedido.value, pedidoId)) {
        return transicionesPorPedido.value[pedidoId]
    }

    const transicion = await obtenerTransicionPedido(pedidoId)
    if (transicion !== undefined) {
        transicionesPorPedido.value = {
            ...transicionesPorPedido.value,
            [pedidoId]: transicion,
        }
    }

    return transicion
}

const obtenerSiguienteTransicion = (pedidoId) => {
    if (!Object.prototype.hasOwnProperty.call(transicionesPorPedido.value, pedidoId)) {
        return undefined
    }
    return transicionesPorPedido.value[pedidoId]
}

const tieneSiguienteTransicion = (pedidoId) => obtenerSiguienteTransicion(pedidoId) !== null

const obtenerTextoBotonEstado = (pedidoId) => {
    const transicion = obtenerSiguienteTransicion(pedidoId)
    if (transicion === undefined) {
        return 'Avanzar estado'
    }
    if (transicion === null) {
        return 'Estado final'
    }
    return transicion.accionLabel || transicion.descripcion || `Marcar como ${transicion.nombre}`
}

const manejarAccionEstado = async (atencion) => {
    const transicion = await asegurarTransicionPedido(atencion.id)

    if (transicion === undefined) {
        mostrarConfirmacion('No se pudo consultar la transición del pedido. Intenta nuevamente en unos segundos.')
        return
    }

    if (!tieneSiguienteTransicion(atencion.id)) {
        mostrarConfirmacion(`El pedido ya se encuentra en el estado final: ${atencion.estado}.`)
        return
    }

    mostrarConfirmacion(
        `¿Confirmas cambiar el pedido #${atencion.numeroPedido || atencion.id} a "${transicion.nombre}"?`,
        () => cambiarEstadoPedido(atencion.id)
    )
}

const obtenerZonas = async () => {
  try {
    const res = await apiService.get('zonas')
    zonas.value = res
  } catch (error) {
    console.error('Error al obtener zonas:', error)
  }
}

const obtenerEstadosPedido = async () => {
  try {
    const res = await apiService.get('estados-pedido-empresa')
    estadosPedido.value = res
  } catch (error) {
    console.error('Error al obtener estados de pedido:', error)
  }
}

const seleccionarPestanaEstado = (tab) => {
        pestanaEstadoRapido.value = tab
}

const coincideConPestanaEstado = (estado, pestana) => {
    if (pestana === 'todos') return true

    const tabSeleccionada = pestanasEstadoRapido.value.find((tab) => tab.key === pestana)
    if (!tabSeleccionada?.estadoNombre) return true

    return normalizarEstado(estado) === normalizarEstado(tabSeleccionada.estadoNombre)
}

const atencionesFiltradas = computed(() => {
  let lista = [...atenciones.value]

    if (!esAdmin.value && pestanaEstadoRapido.value !== 'todos') {
            lista = lista.filter((a) => coincideConPestanaEstado(a.estado, pestanaEstadoRapido.value))
    }

    // Filtro por fecha seleccionada (yyyy-mm-dd) contra fecha mostrada (dd-mm-yyyy / dd/mm/yyyy)
    if (fechaFiltro.value) {
        lista = lista.filter(a => normalizarFechaAISO(a.fecha) === fechaFiltro.value)
    }

    if (fechaInicio.value || fechaFin.value) {
        lista = lista.filter(a => {
            const fecha = normalizarFechaAISO(a.fecha)
            if (!fecha) return false

            if (fechaInicio.value && fecha < fechaInicio.value) return false
            if (fechaFin.value && fecha > fechaFin.value) return false

            return true
        })
    }

    if (estadoSeleccionado.value) {
        lista = lista.filter(a =>
            a.estado?.toLowerCase() === estadoSeleccionado.value
        )
    }

  // Filtro por zona
  if (zonaSeleccionada.value) {
    lista = lista.filter(a =>
      (a.zona && a.zona === zonaSeleccionada.value) ||
      (a.ubicacion && a.ubicacion === zonaSeleccionada.value)
    )
  }



  // Filtro por búsqueda
  if (filtroBusqueda.value) {
    const texto = filtroBusqueda.value.toLowerCase()
    lista = lista.filter(a =>
            (a.id && a.id.toString().includes(texto)) ||
            (a.garzon && a.garzon.toLowerCase().includes(texto)) ||
      (a.ubicacion && a.ubicacion.toLowerCase().includes(texto)) ||
      (a.estado && a.estado.toLowerCase().includes(texto)) ||
      (a.fecha && a.fecha.toLowerCase().includes(texto)) ||
      (a.hora && a.hora.toLowerCase().includes(texto)) ||
      (a.numero && a.numero.toString().includes(texto)) ||
            (a.total && a.total.toString().includes(texto)) ||
      (a.mesa && a.mesa.toString().includes(texto))
    )
  }

  // Ordenar
  if (ordenarPor.value === 'fecha') {
    lista.sort((a, b) => {
      const fa = new Date(a.fecha_creacion || a.fecha)
      const fb = new Date(b.fecha_creacion || b.fecha)
      return ascendente.value ? fa - fb : fb - fa
    })
  } else if (ordenarPor.value === 'monto') {
    lista.sort((a, b) => {
      const ma = parseMonto(a.total)
      const mb = parseMonto(b.total)
      return ascendente.value ? ma - mb : mb - ma
    })
  }

  // Filtro por estado
  if (estadosSeleccionados.value.length > 0) {
    lista = lista.filter(a =>
      estadosSeleccionados.value.includes(a.estado?.toLowerCase())
    )
  }
  // Si no hay ninguno seleccionado, muestra todos los pedidos

  return lista
})

const normalizarFechaAISO = (fechaTexto) => {
    if (!fechaTexto || typeof fechaTexto !== 'string') return ''
    const parts = fechaTexto.split(/[\/-]/)
    if (parts.length !== 3) return ''

    const [dd, mm, yyyy] = parts
    if (!dd || !mm || !yyyy) return ''

    const d = dd.padStart(2, '0')
    const m = mm.padStart(2, '0')
    return `${yyyy}-${m}-${d}`
}

const normalizarEstado = (estado) => {
    if (!estado || typeof estado !== 'string') return ''
    return estado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

const parseMonto = (valor) => {
    if (typeof valor === 'number') {
        return Number.isFinite(valor) ? Math.round(valor) : 0
    }

    if (typeof valor !== 'string') return 0

    const limpio = valor.trim().replace(/[^0-9,.-]/g, '')
    if (!limpio) return 0

    const tienePunto = limpio.includes('.')
    const tieneComa = limpio.includes(',')

    // Caso simple: solo dígitos y un separador decimal (10011.00 / 10011,00)
    if (/^-?\d+[.,]\d+$/.test(limpio)) {
        const numeroSimple = Number(limpio.replace(',', '.'))
        return Number.isFinite(numeroSimple) ? Math.round(numeroSimple) : 0
    }

    let normalizado = limpio

    if (tienePunto && tieneComa) {
        // Si existen ambos, el último separador suele ser decimal.
        const ultimoPunto = limpio.lastIndexOf('.')
        const ultimaComa = limpio.lastIndexOf(',')
        const separadorDecimal = ultimoPunto > ultimaComa ? '.' : ','
        const separadorMiles = separadorDecimal === '.' ? ',' : '.'

        normalizado = limpio.split(separadorMiles).join('')
        if (separadorDecimal === ',') {
            normalizado = normalizado.replace(',', '.')
        }
    } else if (tieneComa) {
        const partes = limpio.split(',')
        if (partes.length > 2) {
            // 1,234,567 -> miles
            normalizado = partes.join('')
        } else if (partes[1]?.length === 3) {
            // 10,011 -> miles
            normalizado = partes.join('')
        } else {
            // 10011,00 -> decimal
            normalizado = limpio.replace(',', '.')
        }
    } else if (tienePunto) {
        const partes = limpio.split('.')
        if (partes.length > 2) {
            // 4.004.400 -> miles
            normalizado = partes.join('')
        } else if (partes[1]?.length === 3) {
            // 10.011 -> miles
            normalizado = partes.join('')
        } else {
            // 10011.00 -> decimal
            normalizado = limpio
        }
    }

    const numero = Number(normalizado)
    return Number.isFinite(numero) ? Math.round(numero) : 0
}

const formatearHoraAMPM = (hora) => {
    if (!hora || typeof hora !== 'string') return ''

    return hora
        .replace(/\s*a\.?\s*m\.?/i, ' am')
        .replace(/\s*p\.?\s*m\.?/i, ' pm')
        .replace(/\s+/g, ' ')
        .trim()
}

const formatearMoneda = (valor) => {
    const numero = parseMonto(valor)
    if (Number.isNaN(numero)) return '$0'
    return `$${Math.round(numero).toLocaleString('es-CL')}`
}

const abrirQrModal = () => {
    showQrModal.value = true
}

const cerrarQrModal = () => {
    showQrModal.value = false
}

const localNombre = computed(() => {
    const localStr = localStorage.getItem('local')
    if (!localStr) return 'Mi Restaurante'
    try {
        const localObj = JSON.parse(localStr)
        return localObj.nombreFantasia || localObj.nombre || 'Mi Restaurante'
    } catch {
        return 'Mi Restaurante'
    }
})

const irANuevaAtencion = () => {
    router.push('/garzon/nuevaatencion')
}

const eliminarPlato = (pedidoId, index) => {
    detallesPedido.value[pedidoId].detalles.splice(index, 1)
}

const calcularTotal = (pedidoId) => {
    const detalles = detallesPedido.value[pedidoId]?.detalles || []
    return detalles.reduce((sum, d) => sum + (d.quantity * d.unit_price), 0)
}

const guardarCambiosPedido = async (pedidoId) => {
    try {
        const pedido = detallesPedido.value[pedidoId];

        const payload = {
            mesa_id: pedido.mesa_id || pedido.mesa?.id,
            order_type: pedido.order_type || "en mesa",
            customer_count: pedido.customer_count || 1,
            platos: pedido.detalles.map(d => ({
                menu_item_id: d.plato.id,
                quantity: d.quantity
            }))
        };

        await apiService.put(`pedidos/${pedidoId}`, payload);

        pedido.detalles.forEach(d => {
            d.editando = false;
        });

        pedido.total_amount = calcularTotal(pedidoId);

        detallesOriginales.value[pedidoId] = JSON.parse(JSON.stringify(pedido));

        detalleVisible.value = null

        mostrarConfirmacion('Pedido actualizado con éxito.');

    } catch (error) {
        console.error('Error al guardar cambios:', error)
        mostrarConfirmacion('Ocurrió un error al guardar los cambios.');
    }
};



const editarCantidad = (pedidoId, index) => {
    const detalle = detallesPedido.value[pedidoId].detalles[index];

    if (!detallesOriginales.value[pedidoId]) detallesOriginales.value[pedidoId] = {};
    detallesOriginales.value[pedidoId][detalle.id] = JSON.parse(JSON.stringify(detalle));

    detallesPedido.value[pedidoId].detalles.forEach((d, i) => {
        d.editando = i === index ? !d.editando : false;
    });
}

const cancelarEdicion = (pedidoId, index) => {
    const detalle = detallesPedido.value[pedidoId].detalles[index];
    const original = detallesOriginales.value[pedidoId]?.[detalle.id];

    if (original) {
        detalle.quantity = original.quantity;
        detalle.unit_price = original.unit_price;
        detalle.editando = false;
    }

    detalleVisible.value = null;
}


const actualizarPrecio = (detalle) => {
    if (detalle && detalle.quantity && detalle.unit_price) {
        detalle.total = detalle.quantity * detalle.unit_price
    }
}

const agregarPlatoAAtencion = (pedidoId, { plato, cantidad }) => {
    const nuevoDetalle = {
        plato,
        quantity: cantidad,
        unit_price: plato.precio
    };

    const detallesExistentes = detallesPedido.value[pedidoId]?.detalles || [];

    const platoExistente = detallesExistentes.find(detalle => detalle.plato.id === plato.id);

    if (platoExistente) {
        platoExistente.quantity += cantidad;
    } else {
        detallesPedido.value = {
            ...detallesPedido.value,
            [pedidoId]: {
                ...detallesPedido.value[pedidoId],
                detalles: [...detallesExistentes, nuevoDetalle]
            }
        };
    }
};

const cancelarEdicionPedido = (pedidoId) => {
    const original = detallesOriginales.value[pedidoId]
    if (original) {
        detallesPedido.value[pedidoId] = JSON.parse(JSON.stringify(original))
    }

    detalleVisible.value = null
}

const hayCambios = (pedidoId) => {
    const original = detallesOriginales.value[pedidoId]
    const actual = detallesPedido.value[pedidoId]

    if (!original || !actual) return false

    if (original.detalles.length !== actual.detalles.length) return true

    for (const detalleActual of actual.detalles) {
        const detalleOriginal = original.detalles.find(d => d.id === detalleActual.id)
        if (!detalleOriginal) return true
        if (detalleActual.quantity !== detalleOriginal.quantity) return true
    }
    return false
}

const cambiarEstadoPedido = async (pedidoId) => {
    try {
        const transicion = await asegurarTransicionPedido(pedidoId)
        if (transicion === undefined) {
            mostrarConfirmacion('No se pudo consultar la transición del pedido. Intenta nuevamente en unos segundos.')
            return
        }

        if (!transicion) {
            const pedido = atenciones.value.find(item => item.id === pedidoId)
            mostrarConfirmacion(`El pedido ya se encuentra en el estado final: ${pedido?.estado || 'actual'}.`)
            return
        }

        await apiService.patch(`pedidos/${pedidoId}/status`, {})

        await obtenerAtenciones();

        if (detalleVisible.value === pedidoId) {
            detalleVisible.value = null;
        }

        transicionesPorPedido.value = {
            ...transicionesPorPedido.value,
            [pedidoId]: undefined,
        }

        mostrarConfirmacion(`Pedido actualizado a ${transicion.nombre}.`);
    } catch (error) {
        console.error('Error al cambiar el estado del pedido:', error);
        mostrarConfirmacion(error?.message || 'Ocurrió un error al cambiar el estado.');
    }
}

const toggleMenu = (pedidoId) => {
    menuAbierto.value = menuAbierto.value === pedidoId ? null : pedidoId
}

// Método para alternar la visibilidad de las opciones
const toggleAtentionActive = (atencion) => {
  // Cerrar todos los demás menús primero
  atenciones.value.forEach(a => {
    if (a.id !== atencion.id) {
      a.isActive = false
    }
  })
  // Alternar el estado de la atencion actual
  atencion.isActive = !atencion.isActive
}

const verAtencion = (atencion) => {
    router.push(`/garzon/veratencion/${atencion.id}`)
}

const editarAtencion = (atencion) => {
    router.push(`/garzon/editaratencion/${atencion.id}`)
}

const confirmarEliminarAtencion = async (atencion) => {
    mostrarConfirmacion('¿Estás seguro de que deseas eliminar este pedido?', async () => {
        try {
            await apiService.delete(`pedidos/${atencion.id}`)
            await obtenerAtenciones()
            mostrarConfirmacion('Pedido eliminado correctamente.')
        } catch (error) {
            mostrarConfirmacion('No se pudo eliminar el pedido.')
            console.error(error)
        }
    })
}

function mostrarConfirmacion(mensaje, accion) {
    confirmMessage.value = mensaje
    confirmAction = accion
    showConfirmModal.value = true
}
function onConfirm() {
    showConfirmModal.value = false
    if (confirmAction) confirmAction()
}
function onCancel() {
    showConfirmModal.value = false
}

function abrirModalFiltros() {
  showModalFiltros.value = true
}
function cerrarModalFiltros() {
  showModalFiltros.value = false
}
function aplicarFiltros() {
  showModalFiltros.value = false
  // El filtrado real se hace en el computed atencionesFiltradas
}

watch(pestanaEstadoRapido, (valor) => {
    localStorage.setItem(QUICK_TAB_STORAGE_KEY, valor)
})

watch(pestanasEstadoRapido, (tabs) => {
    const existe = tabs.some((tab) => tab.key === pestanaEstadoRapido.value)
    if (!existe) {
        pestanaEstadoRapido.value = 'todos'
    }
})

onMounted(() => {
    const tabGuardada = localStorage.getItem(QUICK_TAB_STORAGE_KEY)
    if (tabGuardada) {
        pestanaEstadoRapido.value = tabGuardada
    }

    obtenerLocal()
    obtenerUsuario()
    obtenerEmpresaConfig()
    obtenerAtenciones()
    obtenerZonas()
    obtenerEstadosPedido()
})
</script>

<style scoped>
.page-content--backoffice .page-content__body {
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.page-content--backoffice .page-content__body .element-list {
    height: auto;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 8px;
}

.page-content--backoffice .page-content__footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    z-index: 5;
    padding-top: 8px;
}

.admin-list-filters-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.garzon-list-filters-form {
    width: 100%;
}

.quick-status-tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    white-space: nowrap;
    margin: 10px 0 0;
    padding: 4px;
    background: #eaf1f7;
    border-radius: 10px;
    scrollbar-width: none;
}

.quick-status-tabs::-webkit-scrollbar {
    display: none;
}

.quick-status-tabs__tab {
    flex: 0 0 auto;
    border: none;
    background: transparent;
    color: #7a8fa0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    padding: 8px 14px;
    border-radius: 7px;
    transition: background 0.15s, color 0.15s;
}

.quick-status-tabs__tab.is-active {
    background: #ffffff;
    color: #08a0eb;
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.10);
}

.garzon-order-row .admin-order-row__col strong {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
}

.admin-date-input {
    position: relative;
}

.admin-date-input__label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #9aa7b5;
    pointer-events: none;
}

.admin-date-input input[type='date'] {
    padding-left: 70px;
    color: #0f253f;
}

.admin-date-input input[type='date']:valid + .admin-date-input__label,
.admin-date-input input[type='date']:focus + .admin-date-input__label {
    display: none;
}

.admin-date-input input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
}

.admin-financial-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 12px;
}

.admin-financial-summary__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 74px;
    border: 1px solid #08a0eb;
    border-radius: 10px;
    background: #f0f9ff;
}

.admin-financial-summary__label {
    font-size: 11px;
    font-weight: 700;
    color: #0288d1;
}

.admin-financial-summary__value {
    font-size: clamp(1.5rem, 4vw, 2rem);
    line-height: 1;
    color: #0288d1;
    letter-spacing: -0.2px;
    white-space: nowrap;
}

.admin-order-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.admin-order-row__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 13px;
}

.admin-order-row__columns {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 8px;
}

.admin-order-row__col {
    display: flex;
    flex-direction: column;
    text-align: left;
    min-width: 0;
}

.admin-order-row__col span {
    font-size: 11px;
    color: #08a0eb;
    line-height: 1.1;
}

.admin-order-row__col strong {
    font-size: 12px;
    color: #243447;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.financial-summary__item {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.financial-summary__item span {
    font-size: 0.6rem;
    text-align: center;
}

.financial-summary__item strong {
    font-size: 0.875rem;
    text-align: center;
}

.financial-summary__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #009ee3;
    margin-bottom: 4px;
}

@media (max-width: 900px) {
    .quick-status-tabs__tab {
        font-size: 13px;
        padding: 7px 11px;
    }

    .admin-financial-summary {
        gap: 8px;
    }

    .admin-financial-summary__card {
        min-height: 66px;
    }

    .admin-financial-summary__label {
        font-size: 10px;
    }

    .admin-financial-summary__value {
        font-size: clamp(1.1rem, 5.5vw, 1.7rem);
    }

    .admin-order-row__columns {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
</style>


