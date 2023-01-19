<template>
    <ion-modal>
        <!-- Поиск -->
        <ion-searchbar
            v-model="searchItem"
            placeholder="Поиск..."
            show-cancel-button="always"
            cancelButtonText="Отменить"
            @ionCancel="$emit('closeModal')"
        ></ion-searchbar>

        <!-- Вывод списка -->
        <ion-content forceOverscroll="false" class="ion-margin-top">
            
            <!--  -->
            <ion-item
                v-if="itemsList().length > 0"
                v-for="(item, idx) in itemsList()"
                :key="idx"
                class="ion-no-padding"
                style="margin-top: 1rem; padding: 0 1rem;"
                @click.stop="$emit('addItem', item)"
            >
                {{ item }}
            </ion-item>

            <!--  -->
            <ion-item v-else lines="none">
                <ion-text color="medium">Ничего не найдено</ion-text>
            </ion-item>
        </ion-content>
    </ion-modal>
</template>

<script>
    import { defineComponent, ref, watchEffect } from 'vue';
    //
    import { IonModal, IonSearchbar, IonContent, IonItem, IonText } from "@ionic/vue";
    //
    import store from '../../store/index';

    export default defineComponent({
        name: 'SearchUserWarehouseItem',
        emits: ['closeModal', 'addItem'],
        props: {

        },
        components: {
             IonModal, IonSearchbar, IonContent, IonItem, IonText
        },
        setup(props, { emit }) {
            const searchItem = ref('')
            const itemProperties = ref(props.properties);
            const itemsList = () => {
                let itemsArray = store.state.userWarehouseArray
                return itemsArray
            }
            
            return {
                searchItem, itemsList
            }
        }
    })
</script>

<style scoped>

</style>