<template>
    <div
        class="steps steps--order"
        :aria-label="`Paso ${currentStep} de ${totalSteps}`">

        <div class="steps__track">

            <div
                v-for="(label, index) in stepLabels"
                :key="label"
                class="steps__step">

                <div
                    class="steps__indicator"
                    :class="{
                        'steps__indicator--completed':
                            index + 1 < currentStep,

                        'steps__indicator--active':
                            index + 1 === currentStep,
                    }">

                    <span v-if="index + 1 < currentStep">
                        <Check />
                    </span>

                    <span v-else>
                        {{ index + 1 }}
                    </span>

                </div>

                <span class="steps__label">
                    {{ label }}
                </span>

            </div>

        </div>

        <div class="steps__progress">
            Paso {{ currentStep }} de {{ totalSteps }}
        </div>

    </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'


defineProps({
    currentStep: {
        type: Number,
        required: true,
    },

    totalSteps: {
        type: Number,
        required: true,
    },

    stepLabels: {
        type: Array,
        default: () => [],
    },
})
</script>