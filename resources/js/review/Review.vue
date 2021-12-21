<template>
    <div class="row">
        <div :class="[{'col-md-4': loading || !alreadyReviewed}, {'d-none': !loading && alreadyReviewed}]">
            <div class="card">
                <div class="card-body">
                    <div v-if="loading">Loading...</div>
                    <div v-else>
                        <p>Stayed at <router-link :to="{name: 'bookable', params: {id: booking.bookable.bookable_id}}">{{booking.bookable.title}}</router-link></p>
                        <p>From {{booking.from}} To {{booking.to}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[{'col-md-8': loading || !alreadyReviewed}, {'col-md-12': !loading && alreadyReviewed}]">
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
                        <textarea name="content" id="content" cols="30" rows="10" class="form-control" v-model="review.content"></textarea>
                    </div>

                    <button class="btn btn-lg btn-primary w-100">Submit</button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
export default {
    name: "Review",
    data() {
        return {
            review: {
                rating: 5,
                content: null,
            },
            existingReview: null,
            loading: false,
            booking: false,
        }
    },
    created() {
        this.loading = true;

        axios
            .get(`/api/reviews/${this.$route.params.id}`)
            .then(response => {
                this.existingReview = response.data;
            })
            .catch(error => {
                if (error.response && error.response.status && 404 == error.response.status) {
                    return axios.get(`/api/booking-by-review/${this.$route.params.id}`).then(response => {
                       this.booking = response.data;
                    });
                }
            }).then((response) => {
                console.log(response);
                this.loading = false;
            });
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
        }
    }
}
</script>

