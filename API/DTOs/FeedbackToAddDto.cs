namespace API.DTOs
{
    public class FeedbackToAddDto
    {
        public string Email { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public IFormFile? File { get; set; }
    }
}
