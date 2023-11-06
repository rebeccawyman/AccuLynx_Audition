<template>
    <div class="row">
      <div v-show="Id === 0">
        <Grid @view="UpdateId"></Grid>
      </div>
      <div v-show="Id > 0">
        <Question :id="Id" @back="ClearId"></Question>
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
            Id(): number
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
            },
            ClearId(): void{
                this.selectId = 0;
            }
        },
    });
</script>

<style>
</style>