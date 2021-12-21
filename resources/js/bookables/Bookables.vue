<template>
  <div>
      Row count is {{rows}}
      <div v-if="loading">
          Data is loading...
      </div>
      <div v-else>
          <div class="row mb-4" v-for="row in rows" :key="'row' + row">
            <div
                class="col d-flex align-items-stretch"
                v-for="(bookable, index) in bookablesInRow(row)"
                :key="'row' + row + index"
            >
                <bookable-list-item
                    v-bind="bookable"
                ></bookable-list-item>
            </div>

            <div class="col" v-for="placeholder in placesholdersInRow(row)" :key="'placeholder' + row + placeholder"></div>
          </div>
      </div>
  </div>
</template>

<script>
import BookableListItem from "./BookableListItem";

export default {
    name: "Bookables.vue",
    data() {
        return {
            bookables: null,
            loading: false,
            columns: 3,
        }
    },
    methods: {
        bookablesInRow(row) {
            return this.bookables.slice((row - 1) * this.columns, row * this.columns);
        },
        placesholdersInRow(row) {
            return this.columns - this.bookablesInRow(row).length;
        }
    },
    computed: {
        rows() {
            if (this.bookables === null) {
                return 0;
            }
            return Math.ceil(this.bookables.length / this.columns);
        }
    },
    components: {
        BookableListItem
    },
    created() {
        this.loading = true;

        axios
            .get("/api/bookables")
            .then(response => {
                this.bookables = response.data;
                this.loading = false;
            });
    }
}
</script>
