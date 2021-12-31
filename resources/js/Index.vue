<template>
  <div>
      <nav class="navbar navbar-expand-lg bg-white border-bottom navbar-light">
          <router-link class="navbar-brand mr-auto" :to="{name: 'home'}">LaravelBnb</router-link>

          <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                  <router-link class="nav-link" :to="{name: 'basket'}">
                      Basket
                      <span v-if="itemsInBasket" class="badge alert-success">{{itemsInBasket}}</span>
                  </router-link>
              </li>

              <li class="nav-item" v-if="!isLoggedIn">
                  <router-link :to="{name: 'register'}" class="nav-link">Register</router-link>
              </li>

              <li class="nav-item" v-if="!isLoggedIn">
                  <router-link :to="{name: 'login'}" class="nav-link">Log In</router-link>
              </li>

              <li class="nav-item" v-if="isLoggedIn">
                  <a class="nav-link" href="#" @click.prevent="logout">Log Out</a>
              </li>
          </ul>
      </nav>

      <div class="container my-4 px-4">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex";

export default {
    name: "Index",
    computed: {
        ...mapState({
            lastSearchComputed: state => state.lastSearch,
            isLoggedIn: state => state.isLoggedIn,
        }),
        ...mapGetters({
            itemsInBasket: 'itemsInBasket'
        })
    },
    methods: {
        async logout() {
            try {
                await axios.post('/logout');
                this.$store.dispatch('logout');
            }
            catch (error) {
                this.$store.dispatch('logout');
            }
        }
    }
}
</script>
