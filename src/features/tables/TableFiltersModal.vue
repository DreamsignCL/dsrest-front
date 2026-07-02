<template>
    <BaseModal
        :model-value="modelValue"
        title="Filtros"
        size="sm"
        @update:modelValue="
            $emit(
                'update:modelValue',
                $event
            )
        ">

        <div class="filters-modal">
            <div class="filters-modal__group">
                <h5>Estado de la mesa</h5>

                <div
                    v-for="state in states"
                    :key="state"
                    class="filters-modal__switch">

                    <BaseSwitch
                        :id="`state-${state}`"
                        :label="state"
                        :model-value="
                            localFilters.states.includes(
                                state
                            )
                        "
                        @update:modelValue="
                            toggleState(
                                state,
                                $event
                            )
                        "
                    />

                </div>
            </div>

            <div
                v-if="zones.length"
                class="filters-modal__group">

                <h5>Zona</h5>

                <div
                    v-for="zone in zones"
                    :key="zone.id"
                    class="filters-modal__switch">

                    <BaseSwitch
                        :id="`zone-${zone.id}`"
                        :label="zone.nombre"
                        :model-value="
                            localFilters.zones.includes(
                                zone.id
                            )
                        "
                        @update:modelValue="
                            toggleZone(
                                zone.id,
                                $event
                            )
                        "
                    />

                </div>
            </div>
        </div>

        <template #footer>

            <BaseButton
                type="button"
                variant="outline-primary"
                size="sm"
                @click="resetFilters">
                Limpiar
            </BaseButton>

            <BaseButton
                type="button"
                variant="primary"
                size="sm"
                @click="applyFilters">
                Aplicar
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import {
    reactive,
    watch,
} from 'vue'

import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSwitch from '@/components/ui/BaseSwitch.vue'

const props = defineProps({

    modelValue: {
        type: Boolean,
        default: false,
    },

    filters: {
        type: Object,
        required: true,
    },

    states: {
        type: Array,
        default: () => [],
    },

    zones: {
        type: Array,
        default: () => [],
    },

})

const emit = defineEmits([
    'update:modelValue',
    'apply',
])

const localFilters = reactive({

    states: [],

    zones: [],

})

watch(

    () => props.modelValue,

    isOpen => {

        if (!isOpen) {
            return
        }

        Object.assign(
            localFilters,
            {
                states: [
                    ...props.filters.states,
                ],

                zones: [
                    ...props.filters.zones,
                ],
            }
        )

    }

)

const toggleState = (
    state,
    enabled
) => {

    if (enabled) {

        if (
            !localFilters.states.includes(
                state
            )
        ) {

            localFilters.states.push(
                state
            )

        }

        return
    }

    localFilters.states =
        localFilters.states.filter(
            item => item !== state
        )

}

const toggleZone = (
    zoneId,
    enabled
) => {

    if (enabled) {

        if (
            !localFilters.zones.includes(
                zoneId
            )
        ) {

            localFilters.zones.push(
                zoneId
            )

        }

        return
    }

    localFilters.zones =
        localFilters.zones.filter(
            id => id !== zoneId
        )

}

const resetFilters = () => {

    localFilters.states = []

    localFilters.zones = []

}

const applyFilters = () => {

    emit(
        'apply',
        {
            states: [
                ...localFilters.states,
            ],

            zones: [
                ...localFilters.zones,
            ],
        }
    )

    emit(
        'update:modelValue',
        false
    )

}
</script>