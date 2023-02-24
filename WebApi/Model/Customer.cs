namespace WebApi.Model
{
    public class Customer
    {
        public string acsId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string displayName { get; set; }
        public string customerSince { get; set; }
        public Account[] accounts { get; set; }
        public string address { get; set; }
        public string cityStateZip { get; set; }
        public string ssn { get; set; }
        public string primaryPhone { get; set; }
        public string chatThreadId { get; set; }
        public Document[] documents { get; set; }
        public Meeting[] meetings { get; set; }
    }

    public class Account
    {
        public string number { get; set; }

        public string type { get; set; }
    }

    public class Document
    {
        public string title { get; set; }

        public string date { get; set; }
    }

    public class Meeting
    {
        public string title { get; set; }

        public string date { get; set; }
    }
}
