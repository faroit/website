
<template>
    <div>
        <div v-for="item in pubs">
            <!-- {{ item.csljson.id }} -->
            <!-- TODO: generated infinite loop: <p v-html="renderBib(item.csljson.id)"></p> -->
            <h3 class="title">{{item.csljson.title}} <Badge :text="csltype(item.data.itemType)" :type="csltip(csltype(item.data.itemType))"/> 
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
                <i class="fad fa-bookmark"></i> bibtex
            </a>
            <a :href="exportbib(item.key, 'csljson')">
                <i class="fad fa-bookmark"></i> json
            </a> 
            <a v-if="item.csljson.DOI" :href="'https://dx.doi.org/' + item.csljson.DOI">
                <i class="fad fa-quote-right"></i> DOI
            </a> 

        </div>
    </div>
</template>
<script>
const axios = require('axios')
// import CSL from 'citeproc'

import '@fortawesome/fontawesome-pro/css/all.css'


export default {
  data () {
      return {
          pubs: [],
          api_base: "https://api.zotero.org/users",
          citeproc: Object
      }
  },
  props: [
      'zotero_id'
  ],
  beforeMount() {
    var request_url = `${this.api_base}/${this.zotero_id}/publications/items?format=json&include=data,csljson&sort=date&limit=100&itemType=conferencePaper %7C%7C journalArticle`
    axios.get(request_url)
    .then(response => {
       this.pubs = response.data
        // TODO: this.createProcessor()
    })
    .catch(error => {
        console.log(error);
    })
  },
  methods: {
    createProcessor: function () {
            var chosenStyleID = "ieee";
            var citations = {};
            var itemIDs = [];
            for (var i=0,ilen=this.pubs.length;i<ilen;i++) {
                var item = this.pubs[i].csljson;
                if (!item.issued) continue;
                if (item.URL) delete item.URL;
                var id = item.id;
                citations[id] = item;
                itemIDs.push(id);
            }
            var citeprocSys = {
                retrieveLocale: function (lang){
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-' + lang + '.xml', false);
                    xhr.send(null);
                    return xhr.responseText;
                },
                retrieveItem: function(id){
                    return citations[id];
                }
            };
            function getProcessor(styleID) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl', false);
                xhr.send(null);
                var styleAsText = xhr.responseText;
                var citeproc = new CSL.Engine(citeprocSys, styleAsText)
                return citeproc;
            };
            this.citeproc = getProcessor(chosenStyleID);
    },
    renderBib: function (key) {
        if (key === undefined) {
            return ''
        } else {
            console.log(key)
            this.citeproc.updateItems([key])
            var result = this.citeproc.makeBibliography()
            return result[1].join('\n')
            let example = new Cite('Q21972834')
        }
    }
    ,
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