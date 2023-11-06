<template>
    <div class="container">
        <div class="row border-bottom">
            <div class="col">
                <h1>Question</h1>
                <div class="row">
                    <span>Title: {{ data.title }}</span>
                </div>
                <div class="row">
                    <span>Owner: {{ data.owner}}</span>
                </div>
                <div class="row">
                    <div v-html="data.body"></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h1>Answers</h1>
            </div>
        </div>
        <div class="row border-bottom border-primary" v-for="answer in data.answers" :key="answer.answerId">
            <div class="col">
                <span>{{ answer.owner }}</span>
                <button @click="CheckAccepted(answer.isAccepted)" class="float-end"> Guess Answer</button>
                <div v-html="answer.body"></div>
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