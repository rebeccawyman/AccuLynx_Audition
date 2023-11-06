namespace webapi.models
{
    public class QuestionDisplayModel
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public string Owner { get; set; }
        public List<AnswerDisplayModel> Answers { get; set; }

    }

    public class AnswerDisplayModel
    {   
        public int AnswerId { get; set; }
        public bool IsAccepted { get; set; }
        public string Body { get; set; }
        public string Owner { get; set; }
        public string Link { get; set; }
    }
}
