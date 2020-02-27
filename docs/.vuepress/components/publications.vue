
<template>
    <div>
        <ul v-for="item in pubs">
            <li>
                <span v-for="author in item.author">{{author.family}}, </span>
                {{item.id}} <a v-if="item.scholarurl" :href="item.scholarurl">Scholar</a>
            </li>
        </ul>
    </div>
</template>

<script>
// https://citation.js.org/api/tutorial-cite_.html
// just cite the item, and we are done
import data from './publications.json'
export default {
  data () {
      return {
          pubs: data
      }
  }
}
</script>
