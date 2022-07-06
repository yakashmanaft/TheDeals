<template>
    <div class="spinner-item_wrapper">
        <div class="spinner-item z-20"></div>
    </div>
</template>

<script>
    export default {
        name: 'Spinner'
    }
</script>

<style scoped>
.spinner-item_wrapper {
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 10
}
.spinner-item {
    position: fixed;
    height: 60px;
    width: 60px;
    border: 3px solid transparent;
    border-top-color: #3D3D3D;
    top: 50%;
    left: 50%;
    margin: -30px;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }
  .spinner-item:before, .spinner-item:after{
    content:'';
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
  }
  .spinner-item:before{
    border-top-color: #78D86F;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    animation: spin 3s linear infinite;
  }
  .spinner-item:after{
    border-top-color: #4785E7;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;  
    animation: spin 4s linear infinite;
  }
  @keyframes spin{
    0% {transform: rotate(0deg);}
    100% {transform: rotate(360deg);}
  }
</style>