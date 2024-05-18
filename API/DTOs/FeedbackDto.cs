namespace API.DTOs
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Avatar { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string CreatedAt { get; set; }
        public string Filename { get; set; }
        public bool IsActive { get; set; }
    }
}
