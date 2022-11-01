<!-- <template>
    <div class="avatar">
        <div class="avatar_wrapper" @click="uploadAvatar">
            <img v-if="avatarUrl" :src="avatarUrl" />
            <ion-icon v-else :icon="person" class="no-avatar"></ion-icon>
        </div>
    </div>
</template>

<script>
    import { ref, toRefs, watch, defineComponent } from 'vue';
    import { supabase } from '../supabase/init'
    import { Camera, CameraResultType } from '@capacitor/camera'
    import { IonIcon } from '@ionic/vue'
    import { person } from 'ionicons/icons'

    export default defineComponent({
        name: 'Avatar',
        props: { 
            path: String 
        },
        // https://vpgbroyeiswutvsserbi.supabase.co/storage/v1/object/sign/users/avatars/user-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ1c2Vycy9hdmF0YXJzL3VzZXItYXZhdGFyLnBuZyIsImlhdCI6MTY2NzMwNTMwMCwiZXhwIjoxOTgyNjY1MzAwfQ.3fFFyGS9DPEZ9x8U0yrUZIWaw_c3r414CPN_iXWiA6U
        emits: ['upload', 'update:path'],
        components: {
            IonIcon
        },
        setup(prop, { emit }) {
            const { path } = toRefs(prop)
            const avatarUrl = ref(false)
            //
            const downloadImage = async () => {
                try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(path.value)
                if (error) throw error
                avatarUrl.value = URL.createObjectURL(data)
                } catch (error) {
                console.error('Error downloading image: ', error.message)
                }
            }
            //
            const uploadAvatar = async () => {
                // console.log('clicked upload avatar')
                try {
                    const photo = await Camera.getPhoto({
                        resultType: CameraResultType.DataUrl,
                    })
                    if (photo.dataUrl) {
                        const file = await fetch(photo.dataUrl)
                        .then((res) => res.blob())
                        .then(
                            (blob) =>
                            new File([blob], 'my-file', { type: `image/${photo.format}` })
                        )

                        const fileName = `${Math.random()}-${new Date().getTime()}.${
                        photo.format
                        }`
                        let { error: uploadError } = await supabase.storage
                        .from('avatars')
                        .upload(fileName, file)
                        if (uploadError) {
                        throw uploadError
                        }
                        emit('update:path', fileName)
                        emit('upload')
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            watch(path, () => {
                if (path.value) downloadImage()
            })

            return {
                avatarUrl, uploadAvatar, person, downloadImage
            }
        }
    })
</script>

<style scoped>

</style> -->

<template>
    <div>
        {{avatar_url}}
      <img
        v-if="src !== ''"
        :src="src"
        alt="Avatar"
        class="avatar image"
        :style="{ height: size + 'em', width: size + 'em' }"
      />
      <div v-else class="avatar no-image" :style="{ height: size + 'em', width: size + 'em' }">
            <ion-icon :icon="person" class="no-avatar"></ion-icon>
        </div>
      <div :style="{ width: size + 'em' }">
        <label class="button primary block" for="single">
          {{ uploading ? "Uploading ..." : "Upload" }}
        </label>
        <input
          style="visibility: hidden; position: absolute"
          type="file"
          id="single"
          accept="image/*"
          @change="uploadAvatar"
          :disabled="uploading"
        />
      </div>
    </div>
  </template>

<script setup>
  import { ref, toRefs, watch, onMounted } from 'vue'
  //
  import store from '../store/index';
  import { supabase } from '../supabase/init'
  import { IonIcon } from '@ionic/vue'
import { person } from 'ionicons/icons'

  const prop = defineProps(['path', 'size'])
  const { path, size } = toRefs(prop)

  const emit = defineEmits(['upload', 'update:path'])
  const uploading = ref(false)
  const src = ref('')
  const files = ref()
    //
    const userSettings = ref(store.state.userSettings[0])
    const avatar_url = ref('')

  onMounted(() => {
    
        avatar_url.value = userSettings.value.avatar_url
        console.log(avatar_url.value)
        if(avatar_url.value) {
            src.value = `https://vpgbroyeiswutvsserbi.supabase.co/storage/v1/object/public/avatars/${avatar_url.value}`
        }
  })

  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path.value)
      if (error) throw error
      src.value = URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (evt) => {
    files.value = evt.target.files
    try {
      uploading.value = true
      if (!files.value || files.value.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files.value[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      console.log(filePath)
      
      let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)
      
      // обновляем запись в table 
      updateAccountSettings(filePath)
      //
      if (uploadError) throw uploadError
      emit('update:path', filePath)
      emit('upload')
    } catch (error) {
      alert(error.message)
    } finally {
      uploading.value = false
    }
  }

  const updateAccountSettings = async (filePath) => {
    try {
        //
        let { error } = await supabase.from('accountSettings').update({
            avatar_url: filePath
        }).eq('id', userSettings.value.id)
        if (error) throw error;
    } catch (error) {
            alert(`Error: ${error.message}`)
          }
  }

  watch(path, () => {
    if (path.value) downloadImage()
  })
</script>

<style scoped>
  .avatar {
    display: block;
    margin: auto;
    min-height: 150px;
  }
  .avatar .avatar_wrapper {
    margin: 0.8rem auto 0.8rem;
    border-radius: 50%;
    overflow: hidden;
    height: 8rem;
    aspect-ratio: 1;
    background: var(--ion-color-step-50);
    border: thick solid var(--ion-color-step-200);
  }
  .avatar .avatar_wrapper:hover {
    cursor: pointer;
  }
  .avatar .avatar_wrapper ion-icon.no-avatar {
    width: 100%;
    height: 115%;
  }
  .avatar img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>