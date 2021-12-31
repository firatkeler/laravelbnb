<template>
    <div class="w-50 m-auto">
        <div class="card card-body">
            <form>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" name="name" placeholder="Enter your name" class="form-control" v-model="user.name" :class="[{'is-invalid': errorFor('name')}]" />
                    <v-errors :errors="errorFor('name')"></v-errors>
                </div>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="text" name="email" placeholder="Enter your email" class="form-control" v-model="user.email" :class="[{'is-invalid': errorFor('email')}]" />
                    <v-errors :errors="errorFor('email')"></v-errors>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" :class="{'is-invalid': errorFor('password')}" name="password" placeholder="Enter your password" class="form-control" v-model="user.password" />
                    <v-errors :errors="errorFor('password')"></v-errors>
                </div>
                <div class="form-group">
                    <label for="password_confirmation">Retype Password</label>
                    <input type="password" :class="{'is-invalid': errorFor('password_confirmation')}" name="password_confirmation" placeholder="Confirm your password" class="form-control" v-model="user.password_confirmation" />
                    <v-errors :errors="errorFor('password_confirmation')"></v-errors>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 mt-3" :disabled="loading" @click.prevent="register">Register</button>

                <hr />

                <div class="text-nowrap">
                    Already have an account?
                    <router-link :to="{name: 'login'}" class="font-weight-bold">Log In</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import validationErrors from "../shared/mixins/validationErrors.js";
import {logIn} from "../shared/utils/auth";

export default {
    name: "Register",
    mixins: [validationErrors],
    data() {
        return {
            user: {
                name: null,
                email: null,
                password: null,
                password_confirmation: null,
            },
            loading: false,
        };
    },
    methods: {
        async register() {
            this.loading = true;
            this.errors = null;

            try {
                const response = await axios.post('/register', this.user);

                if (201 == response.status) {
                    logIn();
                    this.$store.dispatch('loadUser');
                    this.$router.push({name: 'home'});
                }
            }
            catch(error) {
                this.errors = error.response && error.response.data.errors;
            }

            this.loading = false;
        }
    }
}
</script>

<style scoped>

</style>
