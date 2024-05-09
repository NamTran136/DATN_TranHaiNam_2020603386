using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public string Time { get; set; }
        public string Filename { get; set; }
    }
}
