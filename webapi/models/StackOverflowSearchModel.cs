namespace webapi.models
{
    public class StackOverflowSearchModel
    {
        public List<Item> items { get; set; }
    }

    public class Item
    {
        public List<string> tags { get; set; }
        public Owner owner { get; set; }
        public bool is_answered {  get; set; }
        public int view_count { get; set; }
        public int answer_count { get; set; }
        public int score { get; set; }
        public int last_activity_date { get; set; }
        public int creation_date { get; set; }
        public int last_edit_date { get; set; }
        public int question_id { get; set; }
        public string content_license { get; set; }
        public string link { get; set; }
        public string title { get; set; }

    }
    public class Owner
    {
        public int account_id { get; set; }
        public int reputation {  get; set; }
        public int user_id { get; set; }
        public string user_type {  get; set; }
        public string profile_image { get; set;}
        public string display_name { get; set;}
        public string line { get; set;}
    }
}
