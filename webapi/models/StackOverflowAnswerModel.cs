namespace webapi.models
{
    public class StackOverflowAnswerModel
    {
        public List<Answer> items { get; set; }
    }

    public class Answer
    {
        public Owner owner { get; set; }
        public bool is_accepted {  get; set; }
        public int score { get; set; }
        public int last_activity_date { get; set; }
        public int creation_date { get; set; }
        public int last_edit_date { get; set; }
        public int answer_id { get; set; }
        public string content_license { get; set; }
        public string body { get; set; }
        public string link { get; set; }

    }
}
