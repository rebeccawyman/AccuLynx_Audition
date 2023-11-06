<template>
    <div>
        <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Answer Count</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="question in data" :key="question.question_id">
                        <td>{{ question.title }}</td>
                        <td>{{ question.answer_count }}</td>
                        <td>{{ question.tags.concat(",") }}</td>
                    </tr>
                </tbody>
            </table>
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
                alert(this.data);
            },
        },
    });
</script>

<style>
</style>