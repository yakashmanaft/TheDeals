<template>
    <ion-list>
        <ion-item lines="none">
            <ion-select interface="action-sheet" :placeholder="placeholder" v-model="selected" @select="$emit('date-updated', selected.value)">
                <ion-select-option
                    v-for="(type, index) in data" 
                    :key="index" 
                    :value="`${type.value}`"
                    >
                        {{type.value}}
                    </ion-select-option>
                    
            </ion-select>
        </ion-item>
    </ion-list>
</template>

<script>
    import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/vue';
    import { watch, ref } from 'vue';
    export default {
        name: 'Select',
        components: {
            IonList, IonItem, IonSelect, IonSelectOption
        },
        props: ['placeholder', 'data'],
        emits: ["date-updated"],
        setup(props, {emit}) {
            const selected = ref('');

            watch(selected, (currentValue) => {
                // console.log(`В селекте ${currentValue}`)
                emit('date-updated', {currentValue})
            })

            return {
                selected
            }
        }
    }
</script>

<style scoped>

</style>