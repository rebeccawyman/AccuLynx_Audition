<template>
    <div class="container">
        <div class="row border-bottom">
            <div class="col-5">
                <span>Title</span>
            </div>
            <div class="col-1">
                <span>Answer Count</span>
            </div>
            <div class="col-2">
                <span>Owner</span>
            </div>
            <div class="col-3">
                <span>Tags</span>
            </div>
            <div class="col-1">
                <span></span>
            </div>
        </div>
        <div class="row border-bottom" v-for="question in data" :key="question.question_id">
            <div class="col-5">
                <span>{{question.title}}</span>
            </div>
            <div class="col-1">
                <span>{{question.answer_count}}</span>
            </div>
            <div class="col-1">
                <span>{{question.owner}}</span>
            </div>
            <div class="col-3">
                <span>{{question.tags}}</span>
            </div>
            <div class="col-1">
                <button @click="View(question.question_id)">View</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { QuestionGridModel } from '@/classes/QuestionGrid';
import { StackOverflowService } from '@/services/stackoverflowService';
import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            const data: QuestionGridModel[] = [];
            return {
                data
            }
        },
        async created() {
            await this.LoadData();
        },
        methods: {
            async LoadData(): Promise<void>{
                this.data = await StackOverflowService.GetGrid();
            },
            View (id: number): void{
                alert(id);
            }
        },
    });
</script>

<style>
</style>