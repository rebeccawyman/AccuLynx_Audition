namespace webapi.models
{
    public class QuestionListModel
    {
        public string tags { get; set; }
        public int answer_count { get; set; }
        public int question_id { get; set; }
        public string title { get; set; }
        public string owner { get; set; }
    }
}
