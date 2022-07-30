<template>
    <ion-list>
        <ion-item lines="none" class="ion-no-padding">
            <ion-select interface="action-sheet" :placeholder="placeholder" v-model="selected" @select="$emit('date-updated', selected.value)">
                <ion-select-option
                    v-for="(item, index) in data" 
                    :key="index" 
                    :value="`${item.value}`"
                    >
                        {{item.name}}
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
                emit('date-updated', {currentValue})
            })
            return {
                selected
            }
        }
    }
</script>

<style scoped>
    ion-select::part(text) {
    color: var(--ion-color-medium);
    }
</style>