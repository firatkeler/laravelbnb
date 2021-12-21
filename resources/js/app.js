require('./bootstrap');

import VueRouter from "vue-router";
import router from "./routes";

import StarRating from "./shared/components/StarRating";

import moment from 'moment';

import Index from "./Index";

window.Vue = require('vue').default;

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.use(VueRouter);

Vue.filter("fromNow", value => moment(value).fromNow());

Vue.component("star-rating", StarRating);

const app = new Vue({
    el: '#app',
    router,
    components: {
        "index": Index
    }
});
