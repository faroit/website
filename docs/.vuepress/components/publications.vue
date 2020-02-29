
<template>
    <div>
        <div v-for="item in pubs">
            <h3 class="title">{{item.data.title}} <Badge :text="item.data.itemType" type="warn"/></h3>
            <span v-for="author in item.data.creators">{{author.firstName}} {{author.lastName}}, </span>
            <a href="#">PDF</a> <a href="#">Demo</a> <a href="#">Website</a>
        </div>
    </div>
</template>
<script>
const axios = require('axios')

export default {
  data () {
      return {
          pubs: []
      }
  },
  props: [
      'url'
  ],
  beforeMount() {
    axios.get(this.url)
    .then(response => {
       console.log(response.data)
       this.pubs = response.data
    })
    .catch(error => {
        console.log(error);
    })
  }
}
</script>

<style>
.title {
    margin-bottom: 0px;
}
.csl-bib-body {
    line-height: 2; 
    padding-left: 0em!important; 
    text-indent: 0em!important;
}
</style>