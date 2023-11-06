<template>
    <div class="row">
      <div class="col-6">
        <Grid @view="UpdateId"></Grid>
      </div>
      <div class="col-6">
        <Question :id="Id"></Question>
      </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Grid from './QuestionGrid.vue'
import Question from "./QuestionAnswer.vue"

    export default defineComponent({
        components:{
            Grid,
            Question
        },
        computed: {
            Id(): Number
            {
                return this.selectId;
            }
        },
        data() {
            const selectId = 0;
            return {
                selectId,
            };
        },
        methods: {
            UpdateId(Id: number): void {
                this.selectId = Id;
            }
        },
    });
</script>

<style>
</style>