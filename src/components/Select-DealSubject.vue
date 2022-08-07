<template>
    <ion-list>
            <ion-select :placeholder="placeholder" v-model="selected" @select="$emit('date-updated', selected.value)">
                <ion-select-option
                    v-for="(item, index) in data" 
                    :key="index" 
                    :value="`${item.value}`"
                    >
                        {{item.name}}
                    </ion-select-option>
            </ion-select>
    </ion-list>
</template>

<script>
    import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
    import { watch, ref } from 'vue';
    export default {
        name: 'SelectDealSubject',
        components: {
            IonList, IonItem, IonSelect, IonSelectOption
        },
        props: ['placeholder', 'data'],
        emits: ["date-updated"],
        setup(props, {emit}) {
            const selected = ref('');
            watch(selected, (currentValue) => {
                emit('date-updated', {currentValue})
            })
            return {
                selected
            }
        }
    }
</script>

<style scoped>
    ion-select {
        --placeholder-opacity: 1;
        --padding-start: 0px;
        --padding-bottom: 0;
        --padding-top: 0;
        --padding-end: 0px;
    }
    ion-list {
        border-radius: 20px;
        background-color: transparent
    }
    ion-select .select-icon {
        visibility: hidden;
    }
    .relative {
        position: relative;
    }
    .absolute {
        position: absolute;
    }
</style>