<template>
    <ion-list>
            <ion-select interface="action-sheet" :placeholder="placeholder" v-model="selected" :disabled="(status === 'deal-complete' || status === 'deal-in-delivery') ? true : false" cancelText="Назад">
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
    import { watch, ref, watchEffect } from 'vue';
    export default {
        name: 'Select',
        components: {
            IonList, IonItem, IonSelect, IonSelectOption
        },
        props: ['placeholder', 'data', 'currentSelected', 'dealStatusCurrentValue', 'dealStatus'],
        emits: ["date-updated"],
        setup(props, {emit}) {
            const selected = ref('');
            const status = ref();
            // selected.value = props.currentSelected
            watch(selected, (currentValue, prevValue) => {
                // setTimeout(() => {

                // }, 300)
                // console.log(props.data)
                
                // console.log(`Это из select prevValue: ${prevValue}`)
                // console.log(`Это из select currentValue: ${currentValue}`)
                // console.log(`Это props: ${props.dealStatusCurrentValue}`)
                emit('date-updated', {currentValue})
                // console.log(status.value)
            })
            watchEffect(() => {
                status.value = props.dealStatus
            })
            return {
                selected, status
            }
        }
    }
</script>

<style scoped>
    ion-select {
        --placeholder-opacity: 1;
        --padding-start: 5px;
        --padding-bottom: 0;
        --padding-top: 0;
        --padding-end: 5px;
    }
    ion-list {
        border-radius: 20px;
        background-color: transparent
    }
</style>