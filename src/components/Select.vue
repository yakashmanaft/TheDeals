<template>
    <div class="v-select">
        <p 
            class="title"
            @click="areOptionsVisible = !areOptionsVisible"
        >
            {{selected}}
        </p>
        <div 
            class="options"
            v-if="areOptionsVisible"
        >
            <p
                v-for="option in options"
                :key="option.name"
                @click="$emit('select', option), areOptionsVisible = false"
            >
                {{option.title}}
            </p>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue'

    export default {
        name: 'Select',
        props: {
            options: {
                type: Array,
                default() {
                    return []
                }
            },
            selected: {
                type: String,
                default: '123'
            }
        },
        setup() {
            const areOptionsVisible = ref(false)

            //
            const hideSelect = () => {
                areOptionsVisible.value = false;
            }


            //
            // onMounted(() => {
            //     document.addEventListener('click', this.hideSelect.bind(this), true)
            // })

            // //
            // onBeforeUnmount(() => {
            //     document.removeEventListener('click', hideSelect())
            // })

            return {
                areOptionsVisible, hideSelect
            }
        }
    }
</script>

<style scoped>
    .v-select {
        position: relative;
        width: 100%;
        cursor: pointer;
    }
    .title {
        border: 1px solid #838383;
    }
    .options {
        border: 1px solid #838383;
        position: absolute;
        top: 25px;
        right: 0;
        width: 100%;
    }
    .options p:hover {
        background: #000;
    }
</style>