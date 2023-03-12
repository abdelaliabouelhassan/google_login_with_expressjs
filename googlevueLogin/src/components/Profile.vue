<template>
  <div v-if="user">
    <h1>Welcome, {{ user.name }}!</h1>
    <p>Email: {{ user.email }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <p>You are not logged in.</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      user: null,
    };
  },
  async created() {
    const token = localStorage.getItem('token');
    if(token){
      await axios.get('http://localhost:4000/api/auth/user?token=' + token).then((res) => {
        this.user = res.data;
        console.log(res.data);
     }).catch((err) => {
      this.user = null;
      console.log(err)
     });
    }
   
  },
  methods: {
    async logout() {
      const token = localStorage.getItem('token');
      await axios.get('http://localhost:4000/api/auth/logout?token=' + token).then((res) => {
        localStorage.removeItem('token');
        this.user = null;
        this.$router.push({path: '/'});
      }).catch((err) => console.log(err));
    },
  },
};
</script>


