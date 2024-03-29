<template>
  <div>
      <success v-if="success">
          You completed process!
      </success>
      <div class="row" v-else>
          <div class="col-md-8" v-if="itemsInBasket">
              <div class="row">
                  <div class="col-md-6 form-group">
                      <label for="first_names">First Names</label>
                      <input type="text" class="form-control" name="first_names" v-model="customer.first_names" :class="[{'is-invalid': errorFor('customer.first_names')}]" />
                      <v-errors :errors="errorFor('customer.first_names')"></v-errors>
                  </div>
                  <div class="col-md-6 form-group">
                      <label for="last_name">Last Name</label>
                      <input type="text" class="form-control" name="last_name" v-model="customer.last_name" :class="[{'is-invalid': errorFor('customer.last_name')}]" />
                      <v-errors :errors="errorFor('customer.last_name')"></v-errors>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-12 form-group">
                      <label for="email">Email</label>
                      <input type="text" class="form-control" name="email" v-model="customer.email" :class="[{'is-invalid': errorFor('customer.email')}]" />
                      <v-errors :errors="errorFor('customer.email')"></v-errors>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-6 form-group">
                      <label for="street">Street</label>
                      <input type="text" class="form-control" name="street" v-model="customer.street" :class="[{'is-invalid': errorFor('customer.street')}]" />
                      <v-errors :errors="errorFor('customer.street')"></v-errors>
                  </div>
                  <div class="col-md-6 form-group">
                      <label for="city">City</label>
                      <input type="text" class="form-control" name="city" v-model="customer.city" :class="[{'is-invalid': errorFor('customer.city')}]" />
                      <v-errors :errors="errorFor('customer.city')"></v-errors>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-6 form-group">
                      <label for="country">Country</label>
                      <input type="text" class="form-control" name="country" v-model="customer.country" :class="[{'is-invalid': errorFor('customer.country')}]" />
                      <v-errors :errors="errorFor('customer.country')"></v-errors>
                  </div>
                  <div class="col-md-4 form-group">
                      <label for="state">State</label>
                      <input type="text" class="form-control" name="state" v-model="customer.state" :class="[{'is-invalid': errorFor('customer.state')}]" />
                      <v-errors :errors="errorFor('customer.state')"></v-errors>
                  </div>
                  <div class="col-md-2 form-group">
                      <label for="zip">Zip</label>
                      <input type="text" class="form-control" name="zip" v-model="customer.zip" :class="[{'is-invalid': errorFor('customer.zip')}]" />
                      <v-errors :errors="errorFor('customer.zip')"></v-errors>
                  </div>
              </div>
              <hr />
              <div class="row">
                  <div class="col-md-12 form-group">
                      <button
                          type="submit"
                          class="btn btn-lg btn-primary w-100"
                          @click.prevent="book"
                          :disabled="loading"
                      >Book Now!</button>
                  </div>
              </div>
          </div>

          <div class="col-md-8" v-else>
              <div class="jumbotron jumbotron-fluid">
                  <div class="container text-center" style="background-color: lightgray">
                      <h1 class="display-4">Empty</h1>
                  </div>
              </div>
          </div>

          <div class="col-md-4">
              <div class="d-flex justify-content-between">
                  <h6 class="text-uppercase text-secondary font-weight-bolder">YOUR CARD</h6>
                  <h6 class="badge alert-success text-uppercase">
                      <span v-if="itemsInBasket">Items {{itemsInBasket}}</span>
                      <span v-else>Empty</span>
                  </h6>
              </div>

              <transition-group name="fade">
                  <div v-for="item in basket" :key="item.bookable.id">
                      <div class="pt-2 pb-2 border-top d-flex justify-content-between">
                          <span>
                              <router-link :to="{name: 'bookable', params: {id: item.bookable.id}}">{{item.bookable.title}}</router-link>
                          </span>
                          <span class="font-weight-bold">
                              ${{item.price.total}}
                          </span>
                      </div>

                      <div class="pt-2 pb-2 d-flex justify-content-between">
                          <span>
                              From {{item.dates.from}}
                          </span>
                          <span>
                              To {{item.dates.to}}
                          </span>
                      </div>

                      <div class="pt-2 pb-2 text-end">
                          <button class="btn btn-sm btn-outline-secondary" @click="$store.dispatch('removeFromBasket', item.bookable.id)">
                              <i class="fas fa-trash-alt"></i>
                          </button>
                      </div>
                  </div>
              </transition-group>
          </div>
      </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import validationErrors from "../shared/mixins/validationErrors";

export default {
    name: "Basket",
    mixins: [validationErrors],
    data() {
        return {
            loading: false,
            customer: {
                first_names: null,
                last_name: null,
                email: null,
                street: null,
                city: null,
                country: null,
                state: null,
                zip: null,
            },
            bookingAttempted: false,
        }
    },
    computed: {
        ...mapGetters(['itemsInBasket']),
        ...mapState({
            basket: state => state.basket.items
        }),
        success() {
            return this.loading == false && 0 == this.itemsInBasket && this.bookingAttempted;
        }
    },
    methods: {
        async book() {
            this.loading = true;
            this.errors = null;
            this.bookingAttempted = false;

            try {
                await axios.post(`/api/checkout`, {
                    customer: this.customer,
                    bookings: this.basket.map(item => ({
                        bookable_id: item.bookable.id,
                        from: item.dates.from,
                        to: item.dates.to
                    }))
                });

                this.$store.dispatch('clearBasket');
            }
            catch (error) {
                this.errors = error.response && error.response.data.errors;
            }

            this.loading = false;
            this.bookingAttempted = true;
        }
    }
}
</script>

<style scoped>
h6.badge {
    font-size: 100%;
}
a {
    color: black;
}
</style>
