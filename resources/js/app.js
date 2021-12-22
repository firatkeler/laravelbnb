require('./bootstrap');

import VueRouter from "vue-router";
import router from "./routes";

import StarRating from "./shared/components/StarRating";
import ValidationErrors from "./shared/components/ValidationErrors";
import FatalError from "./shared/components/FatalError";
import Success from "./shared/components/Success";

import moment from 'moment';

import Index from "./Index";

window.Vue = require('vue').default;

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.use(VueRouter);

Vue.filter("fromNow", value => moment(value).fromNow());

Vue.component("star-rating", StarRating);

Vue.component("fatal-error", FatalError);

Vue.component("success", Success);

Vue.component("v-errors", ValidationErrors);

const app = new Vue({
    el: '#app',
    router,
    components: {
        "index": Index
    }
});
