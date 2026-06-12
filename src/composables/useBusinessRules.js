import { computed, inject } from 'vue'

export function useBusinessRules() {

    const local = inject('currentLocal')

    const rules = computed(() => {

        switch (local.value?.tipo) {

            case 'Cafetería rápida':
                return {
                    usesTables: false,
                    usesZones: false,
                    customerNameRequired: false,
                }

            case 'Restaurante':
                return {
                    usesTables: true,
                    usesZones: true,
                    customerNameRequired: false,
                }

            case 'Foodtruck':
                return {
                    usesTables: false,
                    usesZones: false,
                    customerNameRequired: true,
                }

            case 'Bar':
                return {
                    usesTables: true,
                    usesZones: true,
                    customerNameRequired: false,
                }

            default:
                return {
                    usesTables: false,
                    usesZones: false,
                    customerNameRequired: false,
                }
        }
    })

    return {
        rules,
    }
}