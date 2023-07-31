<template>

    <div class="calendar-date-indicator">{{ selectedMonth }}</div>


</template>
  
<script>
    import { defineComponent, computed } from 'vue';

    //
    // import dayjs from "dayjs";
    import 'dayjs/locale/ru';

    export default defineComponent({
        props: {
            selectedDate: {
                type: Object,
                required: true
            }
        },

        setup(props, { emit }){

            const selectedMonth = computed(() =>
                props.selectedDate.locale('ru').format("MMMM, YYYY")
            )

            return {
                selectedMonth
            }
        }
    })
</script>

<style scoped>
    .calendar-date-indicator {
    font-size: 24px;
    font-weight: 600;
    color: var(--grey-00);
    }
</style>