<template>
  <div>
    <button @click="login">Login with Google</button>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      window.location.href = 'http://localhost:4000/auth/google';
    },
  },
};
</script>
