<template>
    <div class=" w-full flex">
        <div class="w-1/2 flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <h1 class="text-white text-2xl">Loading...</h1>
        </div>

    </div>
</template>


<script>
export default {
    data(){
        return {token: null}
    },
    mounted(){
        this.token = this.$route.query.token;
        localStorage.setItem('token', this.token);
        this.$router.push({path: '/profile'});
    }
}
</script>