require('./bootstrap');

import VueRouter from "vue-router";
import Vuex from "vuex";
import router from "./routes";

import StarRating from "./shared/components/StarRating";
import ValidationErrors from "./shared/components/ValidationErrors";
import FatalError from "./shared/components/FatalError";
import Success from "./shared/components/Success";

import moment from 'moment';

import Index from "./Index";

import storeDefinition from './store';

window.Vue = require('vue').default;

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.filter("fromNow", value => moment(value).fromNow());

Vue.component("star-rating", StarRating);

Vue.component("fatal-error", FatalError);

Vue.component("success", Success);

Vue.component("v-errors", ValidationErrors);

const store = new Vuex.Store(storeDefinition);

window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status == 401) {
            store.dispatch("logout");
        }

        return Promise.reject(error);
    }
);

const app = new Vue({
    el: '#app',
    router,
    store,
    components: {
        "index": Index
    },
    async beforeCreate() {
        store.dispatch("setLastSearchFromLocalStorage");
        store.dispatch("loadUser");

        // await axios.get('/sanctum/csrf-cookie');
        // await axios.post('login', {
        //     email: 'fkertzmann@example.org',
        //     password: 'password',
        // });
        //
        // await axios.get('/user');
    }
});
