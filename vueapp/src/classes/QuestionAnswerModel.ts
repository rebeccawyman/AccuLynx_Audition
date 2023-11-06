
export class AnswerDisplayModel {
        public isAccepted  = false;
        public body = "";
        public owner = "";
        public link = "";
        public answerId = 0;
    }

export class QuestionDisplayModel {
    public title = "";
    public body = "";
    public owner = "";
    public answers: AnswerDisplayModel[] = [];
}

