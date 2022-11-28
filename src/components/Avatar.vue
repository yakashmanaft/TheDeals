<template>
  <div class="avatar">
    <div v-if="avatarUrl" class="avatar_wrapper" @click="changeAvatarMenu()">
      <img :src="avatarUrl" />
    </div>
    <!--  -->
    <div v-else class="avatar_wrapper" @click="uploadAvatar">
      <ion-icon :icon="person" class="no-avatar" color="light"></ion-icon>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, watch, defineComponent, onMounted } from 'vue';
import { supabase } from '../supabase/init';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonIcon } from '@ionic/vue';
import { person } from 'ionicons/icons';
//
import store from '../store/index';
export default defineComponent({
  name: 'AppAvatar',
  props: { path: String },
  emits: ['upload', 'update:path'],
  components: { IonIcon },
  setup(prop, { emit }) {
    const { path } = toRefs(prop);
    const avatarUrl = ref('');
    const userSettings = ref(store.state.userSettings[0])
    onMounted(() => {
        downloadImage()
    })
    const downloadImage = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path.value);
        if (error) throw error;
        avatarUrl.value = URL.createObjectURL(data);
      } catch (error) {
        console.error('Error downloading image: ', error.message);
      }
    };
    const uploadAvatar = async () => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl,
        });
        if (photo.dataUrl) {
          const file = await fetch(photo.dataUrl)
            .then((res) => res.blob())
            .then(
              (blob) =>
                new File([blob], 'my-file', { type: `image/${photo.format}` })
            );
          const fileName = `${Math.random()}-${new Date().getTime()}.${
            photo.format
          }`;
          let { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file);

            // обновляем запись в table 
            updateAccountSettings(fileName)
          if (uploadError) {
            throw uploadError;
          }
          emit('update:path', fileName);
          emit('upload');
        }
      } catch (error) {
        console.log(error);
      }
    };
    //
    const updateAccountSettings = async (fileName) => {
      try {
        //
        let { error } = await supabase.from('accountSettings').update({
            avatar_url: fileName
        }).eq('id', userSettings.value.id)
        if (error) throw error;
      } catch (error) {
        alert(`Error: ${error.message}`)
      }
    }
    watch(path, () => {
      if (path.value) downloadImage();
    });
    //
    const changeAvatarMenu = () => {
      alert('В разработке')
    }
    //
    return { avatarUrl, uploadAvatar, person, userSettings, changeAvatarMenu, updateAccountSettings };
  },
});
</script>
<style>
.avatar {
  display: block;
  margin: auto;
  min-height: 150px;
}
.avatar .avatar_wrapper {
  margin: 16px auto 16px;
  border-radius: 50%;
  overflow: hidden;
  height: 150px;
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
  background-color: var(--ion-color-medium);
}
.avatar img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>