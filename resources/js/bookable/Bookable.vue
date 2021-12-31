<template>
  <div class="row">
      <div class="col-md-8 pb-4">
          <div class="card">
              <div class="card-body">
                  <div v-if="!loading">
                      <h2>{{bookable.title}}</h2>
                      <hr />
                      <article>{{bookable.description}}</article>
                  </div>
                  <div v-else>
                      Loading...
                  </div>
              </div>
          </div>
          <ReviewList :bookable-id="this.$route.params.id"/>
      </div>
      <div class="col-md-4 pb-4">
          <Availability :bookable-id="this.$route.params.id" v-on:availability="checkPrice($event)" class="mb-4"></Availability>

          <transition fade="name">
              <price-breakdown v-if="price" :price="price" class="mb-4"></price-breakdown>
          </transition>

          <transition name="fade">
              <button v-if="price" class="btn btn-outline-secondary w-100" @click="addToBasket" :disabled="inBasketAlready">Book Now</button>
          </transition>

          <button v-if="inBasketAlready" class="btn btn-outline-secondary w-100" @click="removeFromBasket">Remove From Basket</button>

          <div v-if="inBasketAlready" class="mt-4 text-muted warning">Seems like you've added this object to basket already. If you want to change date, remove from the basket first.</div>
      </div>
  </div>
</template>

<script>
import Availability from "./Availability";
import ReviewList from "./ReviewList";
import PriceBreakdown from "./PriceBreakdown";
import {mapState} from "vuex";

export default {
    name: "Bookable",
    components: {
        Availability,
        ReviewList,
        PriceBreakdown
    },
    data() {
        return {
            bookable: null,
            loading: false,
            price: null,
        }
    },
    created() {
        this.loading = true;
        axios
            .get(`/api/bookables/${this.$route.params.id}`)
            .then(response => {
                this.bookable = response.data;
                this.loading = false;
            });
    },
    computed: {
        ...mapState({
            lastSearch: state => state.lastSearch,
        }),
        inBasketAlready() {
            if (this.bookable == null) {
                return false;
            }

            return this.$store.getters.inBasketAlready(this.bookable.id);
        }
    },
    methods: {
        async checkPrice(hasAvailability) {
            if (!hasAvailability) {
                this.price = null;
                return;
            }

            try {
                this.price = (await axios.get(`/api/bookables/${this.bookable.id}/price?from=${this.lastSearch.from}&to=${this.lastSearch.to}`)).data.data;
            }
            catch (error) {
                this.price = null;
            }
        },
        addToBasket() {
            this.$store.dispatch('addToBasket', {
                bookable: this.bookable,
                price: this.price,
                dates: this.lastSearch
            });
        },
        removeFromBasket() {
            this.$store.dispatch('removeFromBasket', this.bookable.id);
        }
    }
}
</script>

<style scoped>
.warning {
    font-size: 0.7rem;
}
</style>
