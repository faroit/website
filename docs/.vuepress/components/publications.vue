
<template>
    <div>
        <div class="pub" v-for="item in pubs">
            <h3 class="title">{{item.csljson.title}} 
                <Badge v-if="item.times_cited" :text="'Citations: ' + item.times_cited"/> 

                <!-- <Badge :text="csltype(item.data.itemType)" :type="csltip(csltype(item.data.itemType))"/>  -->
            </h3>
            <span v-for="author in item.csljson.author">{{author.given}} {{author.family}}, </span>
            <i>{{ item.csljson['container-title'] }}</i>, {{ item.data.date }}
            <a v-if="getfields(item.data.extra).pdf" :href="getfields(item.data.extra).pdf">
                <i class="fas fa-file-pdf"></i>
            </a> 
            <a v-if="item.csljson.URL" :href="item.csljson.URL">
                <i class="fad fa-browser"></i> website
            </a> 
            <a v-if="getfields(item.data.extra).github" :href="getfields(item.data.extra).github">Code</a> 
            <a :href="exportbib(item.key, 'bibtex')">
                <i class="fad fa-file-export"></i> bibtex
            </a>
            <a :href="exportbib(item.key, 'csljson')">
                <i class="fad fa-file-export"></i> json
            </a> 
            <a v-if="item.csljson.DOI" :href="'https://dx.doi.org/' + item.csljson.DOI">
                <i class="fad fa-bookmark"></i> DOI
            </a> 
        </div>
    </div>
</template>
<script>
const axios = require('axios')

import '@fortawesome/fontawesome-pro/css/all.css'


export default {
  data () {
      return {
          pubs: [],
          api_base: "https://api.zotero.org/users"
      }
  },
  props: [
      'zotero_id',
      'filter'
  ],
  beforeMount() {
    var request_url = `${this.api_base}/${this.zotero_id}/publications/items?format=json&include=data,csljson&sort=date&limit=100&${this.filter}`
    axios.get(request_url)
    .then(response => {
       this.pubs = response.data
        for (var i = 0; i < this.pubs.length; i++) {
	        console.log(i); // index
            console.log(this.pubs[i].csljson.DOI); // value
            this.getDimension(this.pubs[i].csljson.DOI, i)
        }
    })
    .catch(error => {
        console.log(error);
    })
  },
  methods: {
    authorIsMe: function (author) {
        if (author.given === "Fabian-Robert" && author.family === "Stöter") {
            return true
        }
    },
    getDimension: function (doi, i) {
        var request_url = `http://metrics-api.dimensions.ai/doi/${doi}`
        if (doi === undefined) {
            return false;
        } else {
            axios.get(request_url)
            .then(response => {
                this.pubs[i].times_cited = response.data.times_cited.toString()
                console.log(this.pubs[i].times_cited)
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
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

<style lang="stylus">
.title {
    margin-bottom: 0px;
}
.csl-bib-body {
    line-height: 2; 
    padding-left: 0em!important; 
    text-indent: 0em!important;
}

.pub a {
  padding: 0.00em 0.2em;
  margin: 0 0.0em 0.1em 0;
}

</style>