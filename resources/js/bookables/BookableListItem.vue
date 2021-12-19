<template>
  <div class="card w-100">
      <div class="card-body">
          <h5 class="card-title">
              {{itemTitle}}
          </h5>
          <p class="card-text">{{itemDescription}}</p>

      </div>
  </div>
</template>

<script>
export default {
    name: "BookableListItem",
    props: {
        "itemTitle": String,
        "itemDescription": String,
        "itemPrice": Number,
    }
}
</script>
