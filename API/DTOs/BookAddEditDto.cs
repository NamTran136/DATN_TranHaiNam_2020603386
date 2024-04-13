using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class BookAddEditDto
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public string Language { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrivate { get; set; }
        [Required]
        public string Category { get; set; }
    }
}
