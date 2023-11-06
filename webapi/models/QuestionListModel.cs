namespace webapi.models
{
    public class QuestionListModel
    {
        public List<string> tags { get; set; }
        public int answer_count { get; set; }
        public int question_id { get; set; }
        public string title { get; set; }
    }
}
