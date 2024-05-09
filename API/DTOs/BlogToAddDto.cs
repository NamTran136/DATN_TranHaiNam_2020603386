namespace API.DTOs
{
    public class BlogToAddDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Time { get; set; }
        public IFormFile File { get; set; }
    }
}
