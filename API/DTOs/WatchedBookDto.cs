namespace API.DTOs
{
    public class WatchedBookDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ImageUrl { get; set; }
        public string CreatedAt { get; set; }
    }
}
