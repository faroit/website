
<template>
    <div>
        <ul v-for="item in pubs">
            <li v-html="item.bib"></li>
        </ul>
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
.csl-bib-body {
    line-height: 2; 
    padding-left: 0em!important; 
    text-indent: 0em!important;
}
</style>