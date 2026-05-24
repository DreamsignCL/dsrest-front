<template>
  <div class="form-container">
    <div class="form-container__header">
      <h2 class="text-primary">Elige tu plan</h2>
      <p>A continuación selecciona el plan que más se acomode a la necesidad de tu negocio</p>
    </div>

    <div class="form-container__body">
      <div id="accordionPlans" class="accordion">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="accordion-item accordion-item--plan"
          :class="{ selected: selectedPlan === index }"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :class="{ collapsed: selectedPlan === index }"
              :data-bs-target="`#collapse${index}`"
              :aria-expanded="expandedIndex === index ? 'true' : 'false'"
              :aria-controls="`collapse${index}`"
              @click="toggleExpanded(index)"
            >
              <div class="accordion-item__icon"></div>
              <p>
                <span class="fs-4 fw-bold text-primary">{{ plan.name }}</span
                ><br />
                <small class="text-secondary">{{ plan.price }}</small>
              </p>
            </button>
          </h2>
          <div
            :id="`collapse${index}`"
            class="accordion-collapse collapse"
            :class="{ collapse: selectedPlan === index }"
            data-bs-parent="#accordionPlans"
          >
            <div class="accordion-body">
              <span class="fw-bold text-primary">¿Qué incluye?</span>
              <ul class="ps-3">
                <li v-for="(feature, i) in plan.features" :key="i">
                  {{ feature }}
                </li>
              </ul>
              <div class="plan-billing">
                <strong class="text-primary">Facturación:</strong><br />
                {{ plan.billing }}
              </div>
              <div class="terms">
                <input
:id="'terms-' + index"
v-model="acceptedTerms" type="checkbox"
@click.stop />
                <label :for="'terms-' + index">
                  Acepto los
                  <button type="button" @click.stop="showTermsModal = true">
                    términos y condiciones
                  </button>
                </label>
              </div>
              <div class="d-grid gap-2">
                <button
                  class="btn btn-outline-primary rounded-pill"
                  :disabled="!acceptedTerms"
                  @click.stop="selectPlan(index)"
                >
                  Seleccionar este plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="planError" class="message error-message animate__animated animate__fadeInUp">
        {{ planError }}
      </div>
    </div>

    <!-- Botón de confirmar e ir al pago -->
    <div class="form-container__footer">
      <button class="btn btn-outline-primary rounded-pill" @click="$emit('back')">Volver</button>
      <button
        class="btn btn-primary rounded-pill"
        :disabled="selectedPlan === null || isLoading"
        @click="confirmPlan"
      >
        {{ isLoading ? 'Procesando...' : 'Confirmar y pagar' }}
      </button>
    </div>

    <!-- Modal de Términos y Condiciones -->
    <div
      v-if="showTermsModal"
      class="modal animate__animated animate__fadeIn"
      @click.self="showTermsModal = false"
    >
      <div class="modal-content animate__animated animate__fadeInUp">
        <div class="modal-header">
          <h5>Términos y Condiciones</h5>
          <button class="btn-close" type="button" @click="showTermsModal = false"></button>
        </div>
        <div class="modal-body">
          <p>
            Estos son unos términos y condiciones de ejemplo.<br />
            Puedes reemplazar este texto por los términos reales de tu servicio.<br /><br />
            1. El usuario acepta las condiciones del servicio.<br />
            2. El uso indebido puede resultar en la suspensión.<br />
            3. Los datos serán tratados según la política de privacidad.<br />
            4. ...<br />
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary rounded-pill" @click="showTermsModal = false">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanSelection',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'back', 'update:selectedPlan'],
  data() {
    return {
      selectedPlan: null,
      tempSelectedPlan: null,
      planError: '',
      acceptedTerms: false,
      showTermsModal: false,
      expandedIndex: null,
      plans: [
        {
          name: 'Plan Admin',
          price: '$9.990 CLP / $10 USD',
          numericPrice: 9990,
          id: 1,
          features: ['Crear y editar platos', 'Editar perfil', 'Soporte básico'],
          billing: 'Mensual',
        },
        {
          name: 'Plan Básico',
          price: '$19.990 CLP / $20 USD',
          numericPrice: 19990,
          id: 2,
          features: [
            'Crear y editar platos',
            'Editar perfil',
            'Soporte estándar',
            'Estadísticas básicas',
          ],
          billing: 'Mensual o Anual',
        },
        {
          name: 'Plan Avanzado',
          price: '$29.990 CLP / $30 USD',
          numericPrice: 29990,
          id: 3,
          features: [
            'Crear y editar platos',
            'Editar perfil',
            'Soporte avanzado',
            'Estadísticas avanzadas',
            'Gestión de promociones',
          ],
          billing: 'Mensual o Anual',
        },
        {
          name: 'Plan Premium',
          price: '$39.990 CLP / $40 USD',
          numericPrice: 39990,
          id: 4,
          features: [
            'Todas las funciones del plan avanzado',
            'Soporte prioritario',
            'Integraciones externas',
          ],
          billing: 'Mensual o Anual',
        },
      ],
    }
  },
  methods: {
    toggleExpanded(index) {
      // Si ya está expandido, colapsarlo
      this.expandedIndex = this.expandedIndex === index ? null : index
    },
    togglePlan(index) {
      if (this.tempSelectedPlan === index) {
        this.tempSelectedPlan = null
        this.acceptedTerms = false
      } else {
        this.tempSelectedPlan = index
        this.acceptedTerms = false
      }
    },
    selectPlan(index) {
      if (!this.acceptedTerms) return
      this.selectedPlan = index
      this.planError = ''
      this.$emit('update:selectedPlan', this.plans[index])
      // Opcional: cerrar el recuadro después de seleccionar
      this.tempSelectedPlan = null
      this.acceptedTerms = false
    },
    confirmPlan() {
      if (this.selectedPlan === null) {
        this.planError = 'Por favor seleccione un plan'
        return
      }
      this.planError = ''
      // Pasar el plan completo con precio numérico
      this.$emit('confirm', {
        ...this.plans[this.selectedPlan],
        selectedIndex: this.selectedPlan,
      })
    },
  },
}
</script>
