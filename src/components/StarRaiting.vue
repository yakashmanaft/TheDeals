<template>
    <!-- https://codepen.io/olimorris/pen/yOYBjd -->
    <ion-grid class="ion-no-padding border-bottom ion-padding-bottom">
        <ion-row class="star-rating ion-justify-content-between ion-align-items-center">
            <div>
                <ion-label 
                    class="star-rating__star" 
                    v-for="(rating, i) in ratings" :key="i"
                    :class="{ 'is-selected': ((value >= rating) && value != null)}"   
                    @click="set(i)"
                >
                    <input 
                        type="radio" 
                        :value="rating" 
                        :name="name"
                        v-model="value"
                        :disabled="disabled" 
                        class="star-rating__checkbox"
                    />
                    <ion-icon :icon="star"></ion-icon>
                </ion-label>
            </div>
            <ion-text color="medium">{{value}} из 5</ion-text>
        </ion-row>
    </ion-grid>
</template>

<script>
    import { defineComponent, ref, watchEffect, watch } from 'vue';
    //
    import { IonLabel, IonRadio, IonIcon, IonText, IonGrid, IonRow } from '@ionic/vue';
    import { star } from 'ionicons/icons';
    //
    export default defineComponent({
        name: 'Star-raitng',
        emits: ['getRatingValue'],
        props: {
            name: String,
            value: null,
            id: String,
            disabled: Boolean,
            required: Boolean,
            dealStatus: String
        },
        components: {
            IonLabel, IonRadio, IonIcon, IonText, IonGrid, IonRow
        },
        setup(props, { emit }) {
            //
            // const temp_value = ref(null)
            const ratings =  ref([1, 2, 3, 4, 5])
            const value = ref()
            const status = ref()
            //
            const set = (i) => {
                // console.log(status.value)
                if(status.value === 'deal-complete') {
                    alert('StarRating: вы не можете изменить дело, если статус "ЗАВЕРШЕН"')
                    return value.value = value.value;
                } else {
                    return value.value = i + 1
                }
            }
            //
            watchEffect(() => {
                value.value = props.value
                status.value = props.dealStatus
            })
            //
            watch(value, () => {
                // console.log(value.value)
                emit('getRatingValue', value.value)
            })

            return {
                ratings, star, set, value, status
            }
        }  
    })
</script>

<style scoped>
    .star-rating {
    }
    .star-rating__star {
        display: inline-block;
        padding: 3px;
        vertical-align: middle;
        line-height: 1;
        font-size: 1.5em;
        color: var(--ion-color-medium);
        transition: color .2s ease-out;
        margin-right: 0.8rem;
    }
    .is-selected {
      color: #FFD700;
    }
    .star-rating__checkbox {
        /* visibility: hidden */
        display: none;
    }
    .border-bottom {
        border-bottom: 1px solid var(--ion-color-light);
    }
</style>