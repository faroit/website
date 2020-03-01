
<template>
    <div>
        <div v-for="item in pubs">
            <h3 class="title">{{item.csljson.title}} <Badge :text="item.csljson.type" type="warn"/></h3>
            <span v-for="author in item.csljson.author">{{author.given}} {{author.family}}, </span>
            <a href="#">PDF</a> <a v-if="item.csljson.DOI" href="#">Demo</a> 
            <a v-if="item.csljson.URL" :href="item.csljson.URL">Website</a> 
            <a v-if="getfields(item.data.extra).github" :href="getfields(item.data.extra).github">Code</a> 
            <a :href="exportbib(item, 'bibtex')">Bibtex</a> 
            <a v-if="item.csljson.DOI" :href="item.csljson.DOI">DOI</a>
        </div>
    </div>
</template>
<script>
const axios = require('axios')
// const cite = require('citation-js')

export default {
  data () {
      return {
          pubs: []
      }
  },
  props: [
      'zotero_url'
  ],
  beforeMount() {
    axios.get(this.zotero_url)
    .then(response => {
       this.pubs = response.data
    })
    .catch(error => {
        console.log(error);
    })
  },
  methods: {
    exportbib: function (key, format) {
      return `https://api.zotero.org/users/6408178/publications/items/${key}?format=${format}`
    },
    getfields: function (extra) {
        // code from https://github.com/zotero/zotero/blob/cbfa4be437fbe0451795a9a865ed163fa7cc2376/chrome/content/zotero/xpcom/cite.js
        
        var fields = {}
		var ex = extra.replace(/^([A-Za-z \-]+)(:\s*.+)/gm, function (_, field, value) {
            var field = field.toLowerCase().replace(/ /g, '-');
            console.log(value)
            return fields[field]= value.slice(2);
        });
        return fields;
    }
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