<template>
    <div class="row">

<!--        <div v-if="error" class="row">-->
<!--            Unknown Error!-->
<!--        </div>-->
        <success v-if="success">
            You've left a review!
        </success>
        <fatal-error v-if="error"></fatal-error>
        <div v-if="!success && !error" class="row">
            <div :class="[{'col-md-4': twoColumns}, {'d-none': oneColumn}]">
                <div class="card">
                    <div class="card-body">
                        <div v-if="loading">Loading...</div>
                        <div v-if="hasBooking">
                            <p>Stayed at <router-link :to="{name: 'bookable', params: {id: booking.bookable.bookable_id}}">{{booking.bookable.title}}</router-link></p>
                            <p>From {{booking.from}} To {{booking.to}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="[{'col-md-8': twoColumns}, {'col-md-12': oneColumn}]">
                <div v-if="loading">Loading...</div>
                <div v-else>
                    <div v-if="alreadyReviewed">
                        <h3>You've already left a review</h3>
                    </div>
                    <div v-else>
                        <div class="form-group">
                            <label class="text-muted">
                                Select the star rating
                            </label>
                            <!--            <star-rating :rating="review.rating" class="fa-3x" v-on:rating:changed="review.rating = $event"></star-rating>-->
                            <star-rating v-bind:value="review.rating" v-on:input="review.rating = $event" class="fa-3x"></star-rating>
                            <!--            <star-rating v-model="review.rating" class="fa-3x"></star-rating>-->
                        </div>
                        <div class="form-group pt-4">
                            <label for="content" class="text-muted">
                                Describe your experience
                            </label>
                            <textarea name="content" id="content" cols="30" rows="10" class="form-control" v-model="review.content" :class="[{'is-invalid': errorFor('content')}]"></textarea>
                            <v-errors :errors="errorFor('content')"></v-errors>

                        </div>

                        <button class="btn btn-lg btn-primary w-100" @click.prevent="submit" :disabled="sending">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {is404, is422} from '../shared/utils/response';
import validationErrors from "../shared/mixins/validationErrors";

export default {
    mixins: [validationErrors],
    name: "Review",
    data() {
        return {
            review: {
                id: null,
                rating: 5,
                content: null,
            },
            existingReview: null,
            loading: false,
            booking: null,
            error: false,
            sending: false,
            success: false,
        }
    },
    async created() {
        this.review.id = this.$route.params.id;

        this.loading = true;

        try {
            this.existingReview = (await axios.get(`/api/reviews/${this.review.id}`)).data;
        } catch(error) {
            if (is404(error)) {
                try {
                    this.booking = (await axios.get(`/api/booking-by-review/${this.review.id}`)).data;
                }
                catch (error) {
                    if (!is404(error)) {
                        this.error = true;
                    }
                }
            }
            else {
                this.error = true;
            }
        }

        this.loading = false;

        // axios
        //     .get(`/api/reviews/${this.review.id}`)
        //     .then(response => {
        //         console.log('ressss')
        //         this.existingReview = response.data;
        //     })
        //     .catch(error => {
        //         if (is404(error)) {
        //             return axios.get(`/api/booking-by-review/${this.review.id}`).then(response => {
        //                this.booking = response.data;
        //             }).catch((error) => {
        //                 if (!is404(error)) {
        //                     this.error = true;
        //                 }
        //             });
        //         }
        //
        //         this.error = true;
        //     }).then((response) => {
        //         this.loading = false;
        //     });
    },
    computed: {
        alreadyReviewed() {
            return this.hasReview || !this.booking;
        },
        hasReview() {
            return this.existingReview !== null;
        },
        hasBooking() {
            return this.booking !== null;
        },
        oneColumn() {
            return !this.loading && this.alreadyReviewed;
        },
        twoColumns() {
            return this.loading || !this.alreadyReviewed;
        }
    },
    methods: {
        submit() {
            this.errors = null;
            this.sending = true;
            this.success = false;

            axios
                .post(`/api/reviews`, this.review)
                .then(response => {
                    this.success = response.status == 201;
                })
                .catch(error => {
                    if (is422(error)) {
                        const errors = error.response.data.errors;

                        if (errors["content"] && _.size(errors) === 1) {
                            this.errors = errors;
                            return;
                        }
                    }

                    this.error = true;
                }).then(() => this.sending = false);
        }
    }
}
</script>


