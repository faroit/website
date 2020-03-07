
<template>
    <div>
        <div v-for="item in pubs">
            <h3 class="title">{{item.csljson.title}} <Badge :text="csltype(item.data.itemType)" :type="csltip(csltype(item.data.itemType))"/></h3>
            <span v-for="author in item.csljson.author">{{author.given}} {{author.family}}, </span>
            <a v-if="getfields(item.data.extra).pdf" :href="getfields(item.data.extra).pdf">PDF</a> <a v-if="item.csljson.DOI" :href="item.csljson.DOI">DOI</a> 
            <a v-if="item.csljson.URL" :href="item.csljson.URL">Website</a> 
            <a v-if="getfields(item.data.extra).github" :href="getfields(item.data.extra).github">Code</a> 
            <a :href="exportbib(item.key, 'bibtex')">Bibtex</a> 
            <a :href="exportbib(item.key, 'csljson')">CSL-JSON</a> 
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
          pubs: [],
          api_base: "https://api.zotero.org/users"
      }
  },
  props: [
      'zotero_id'
  ],
  beforeMount() {
    var request_url = `${this.api_base}/${this.zotero_id}/publications/items?format=json&include=data,csljson&sort=date&limit=100`
    axios.get(request_url)
    .then(response => {
       this.pubs = response.data
    })
    .catch(error => {
        console.log(error);
    })
  },
  methods: {
    exportbib: function (key, format) {
      return `${this.api_base}/${this.zotero_id}/publications/items/${key}?format=${format}`
    },
    csltype: function (type) {
        switch(type) {
            case "conferencePaper":
                return "conference"
            case "journalArticle":
                return "journal"
            case "document":
                return "dataset"
            default:
                return type
            } 
    },
    csltip: function (type) {
        switch(type) {
            case "conference":
                return "warn"
            case "journal":
                return "error"
            case "data":
                return "info"
            default:
                return "info"
            } 
    },
    getfields: function (extra) {
        // code from https://github.com/zotero/zotero/blob/cbfa4be437fbe0451795a9a865ed163fa7cc2376/chrome/content/zotero/xpcom/cite.js
        var fields = {}

        if (extra === undefined) {
            return fields;
        }
		var ex = extra.replace(/^([A-Za-z \-]+)(:\s*.+)/gm, function (_, field, value) {
            var field = field.toLowerCase().replace(/ /g, '-');
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