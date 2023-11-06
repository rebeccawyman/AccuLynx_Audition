<template>
    <div class="container">
        <div class="row border-bottom">
            <div class="col">
                <span>{{ data.title }}</span>
                <span>{{ data.owner}}</span>
                <div>{{ data.body }}</div>
            </div>
        </div>
        <div class="row board-bottom" v-for="answer in data.answers" :key="answer.answerId">
            <div class="col">
                <span>{{ answer.owner }}</span>
                <button @click="CheckAccepted(answer.isAccepted)"> Guess Answer</button>
                <div>{{ answer.body }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { QuestionDisplayModel } from '@/classes/QuestionAnswerModel';
import { StackOverflowService } from '@/services/stackoverflowService';
import { defineComponent } from 'vue';

    export default defineComponent({
    props: {
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        const data: QuestionDisplayModel = new QuestionDisplayModel();
        return {
            data
        };
    },
    watch:{
        async id(): Promise<void>{
            this.data = await StackOverflowService.GetQuestion(this.id);
        }
    },
    methods: {
        CheckAccepted(IsAccepted: boolean): void{
            if(IsAccepted){
                alert("Correct, this is the accepted answer");
            }
            else{
                alert("This is not the accpted answer");
            }
        }
    },
});
</script>

<style>
</style>